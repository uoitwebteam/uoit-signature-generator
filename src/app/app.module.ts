import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

/* App root */
import { AppComponent } from './app.component';

/* Feature modules */
import { SignatureFormModule } from './signature-form/signature-form.module';
import { SignaturePreviewModule } from './signature-preview/signature-preview.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';

@NgModule({
  imports: [
    BrowserModule,
    SignatureFormModule,
    SignaturePreviewModule,
    RouterModule.forRoot([]),
    CoreModule.forRoot({ url: 'https://api.ontariotechu.ca/directory' }),
    SharedModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
