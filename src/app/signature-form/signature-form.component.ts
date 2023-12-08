import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CompleterService, LocalData } from 'ng2-completer';

import { map } from 'rxjs/operators';

import {
  SocialNetworks,
  SocialNetworkData,
  ButtonStyles,
  EventIcons,
  BrandLogos,
  FormData
} from '../shared/models';
import { LdapColumns } from '../shared';
import { DirectoryService } from '../core/directory.service';
import { UploaderService, UploadRecord } from '../core/uploader.service';

import { Logger } from '../shared/logger';

const DIGIT = /\d/;
const DIGIT_1TO9 = /[1-9]/;

/**
 * @example
 * <signature-form (formChange)="onFormChange($event)"></signature-form>
 */
@Component({
  selector: 'signature-form',
  styleUrls: ['./signature-form.component.scss'],
  templateUrl: './signature-form.component.html'
})
export class SignatureFormComponent implements OnInit {
  @Output()
  formChange = new EventEmitter<FormData>();
  @Output()
  formSubmit = new EventEmitter();

  socialNetworks = SocialNetworks;
  buttonStyles = ButtonStyles;
  eventIcons = EventIcons;
  brandLogos = BrandLogos;
  phoneMask = [DIGIT_1TO9, DIGIT, DIGIT, '.', DIGIT, DIGIT, DIGIT, '.', DIGIT, DIGIT, DIGIT, DIGIT];
  directoryData: {
    firstNames: LocalData;
    lastNames: LocalData;
    titles: LocalData;
    emails: LocalData;
    departments: LocalData;
  };
  formData: FormGroup;

  showUploader$ = this.route.queryParams.pipe(map(params => !!params.hasOwnProperty('uploader')));
  uploadDragging = false;
  uploadUploading = false;
  uploadProgress = 0;
  uploadSuccess = false;
  uploadError = false;
  uploadMessage = '';

  private logger = new Logger('signature-form.component');

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private directory: DirectoryService,
    private completer: CompleterService,
    private uploader: UploaderService
  ) { }

  ngOnInit() {
    this.buildForm();
    const directory$ = this.directory.getAll();
    const departments$ = this.directory.getDepartments();
    this.directoryData = {
      firstNames: this.completer.local(directory$, LdapColumns.NAME_FIRST, LdapColumns.NAME_FIRST),
      lastNames: this.completer.local(directory$, LdapColumns.NAME_LAST, LdapColumns.NAME_LAST),
      titles: this.completer.local(directory$, LdapColumns.TITLE, LdapColumns.TITLE),
      emails: this.completer.local(directory$, LdapColumns.EMAIL, LdapColumns.EMAIL),
      departments: this.completer.local(departments$)
    };
  }

  buildForm() {
    this.formData = this.fb.group({
      name: this.fb.group({
        first: ['', Validators.required],
        last: ['', Validators.required],
        pronouns: ''
      }),
      contact: this.fb.group({
        phone: ['905.721.8668', Validators.required],
        ext: '',
        mobile: '',
        fax: '',
        faxext: '',
        email: ['', Validators.required],
        website: ['ontariotechu.ca', Validators.required]
      }),
      credentials: this.fb.group({
        title: '',
        dept: ''
      }),
      hours: '',
      social: this.fb.group({
        style: this.buttonStyles[0],
        networks: this.fb.array([
          this.initSocial({ type: 'fb', username: 'ontariotechu' }),
          this.initSocial({ type: 'tw', username: 'ontariotech_u' }),
          this.initSocial({ type: 'li', username: 'ontariotech', account: 'school' }),
          this.initSocial({ type: 'yt', username: 'ontariotech', account: 'c' }),
          this.initSocial({ type: 'in', username: 'ontariotechu' }),
          this.initSocial({ type: 'ti', username: 'ontariotechu' })
        ])
      }),
      logo: this.brandLogos[0].options[0],
      image: this.fb.group({
        src: '',
        alt: '',
        href: '',
        scale: [100, [Validators.min(0), Validators.max(100)]],
        width: [null, [Validators.min(0), Validators.max(600)]]
      }),
      feature: this.fb.group({
        anniversary: false,
        research: false
      }),
      event: this.fb.group({
        use: false,
        data: this.fb.group({
          icon: this.eventIcons[0],
          size: '',
          name: '',
          date: '',
          desc: '',
          cta: '',
          url: ''
        })
      }),
      message: this.fb.group({
        style: '',
        content: '',
        brand: true,
        acknowledgement: true,
        acknowledgementImage: true,
      })
    });

    this.formData.valueChanges.subscribe(data => this.onFormChange(data));

    this.onFormChange(this.formData.value);
  }

  initSocial({ type = '', username = '', account = null } = {}) {
    const socialNetwork = this.getSocialNetwork(type);
    const formGroup: SocialNetworkData = {
      type: socialNetwork,
      username: [username, Validators.required],
      account: null
    };
    if (socialNetwork && socialNetwork.options && account) {
      formGroup.account = socialNetwork.options.find(option => option.value === account);
    }
    return this.fb.group(formGroup);
  }

  get socialControls() {
    return <FormGroup>this.formData.controls['social'];
  }

  get socialNetworksControls() {
    return <FormArray>this.socialControls.controls['networks'];
  }

  get imageControls() {
    return <FormGroup>this.formData.controls['image'];
  }

  getSocialNetwork(type: string) {
    return this.socialNetworks.find(network => network.value === type);
  }

  addSocial() {
    this.socialNetworksControls.push(this.initSocial());
  }

  removeSocial(i) {
    this.socialNetworksControls.removeAt(i);
  }

  onDropFile(event: DragEvent) {
    event.preventDefault();
    this.uploadFile(event.dataTransfer.files);
    this.uploadDragging = false;
  }

  onDragOverFile(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  onDragEnterFile() {
    this.uploadDragging = true;
  }

  onDragLeaveFile() {
    this.uploadDragging = false;
  }

  selectFile(file: File | UploadRecord) {
    this.imageControls.patchValue({
      src: `../uploads/${file.name}`
    });
  }

  uploadFile(files: FileList) {
    this.uploadUploading = true;

    if (files && files.length) {
      const file: File = files[0];
      this.uploader.uploadFile(file).subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round((100 * event.loaded) / event.total);
          } else if (event instanceof HttpResponse) {
            const responseBody = event.body;
            this.uploadSuccess = true;
            this.uploadMessage = responseBody.message;
            this.selectFile(file);
            this.resetUploadDetails();
          }
        },
        event => {
          this.uploadError = true;
          this.uploadMessage = event.error.message;
          this.resetUploadDetails();
        }
      );
    }
  }

  onFormChange(data: FormData) {
    this.logger.logGroup('signature change', data);
    this.formChange.emit(data);
  }

  onSubmit(event, formData) {
    event.preventDefault();
    this.formSubmit.emit(formData);
  }

  private resetUploadDetails() {
    setTimeout(() => {
      this.uploadDragging = false;
      this.uploadUploading = false;
      this.uploadProgress = 0;
      this.uploadSuccess = false;
      this.uploadError = false;
      this.uploadMessage = '';
    }, 3000);
  }
}
