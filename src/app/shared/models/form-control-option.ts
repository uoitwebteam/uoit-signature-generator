/**
 * Base interface for options of form controls,
 * such as the `<option>`s in a `<select>`.
 *
 * @export
 * @interface FormControlOption
 */
export interface FormControlOption {
  /**
   * The form control's value, i.e. what becomes the
   * `<input value="...">` of the control.
   *
   * @type {string}
   * @memberof FormControlOption
   */
  value: string;
  /**
   * The form control's label text, i.e. what is rendered
   * inside a `<label>...</label>` or inside an
   * `<option>...</option>`.
   *
   * @type {string}
   * @memberof FormControlOption
   */
  name: string;
  /**
   * Optional: if the form control has an associated `<img>`,
   * the URL given here will make the `src="..."`.
   *
   * @type {string}
   * @memberof FormControlOption
   */
  src?: string;
  /**
   * Optional: if the form control has an associated `<a>`,
   * the URL given here will make the `href="..."`.
   *
   * @type {string}
   * @memberof FormControlOption
   */
  href?: string;
  /**
   * Optional: tagline text to display under the logo.
   *
   * @type {string}
   * @memberof FormControlOption
   */
  tagline?: string;
}

export interface FormControlOptGroup {
  name: string;
  options: FormControlOption[];
}
