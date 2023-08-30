import { FormControlOption } from '.';

export interface SocialNetworkOption {
  label: string;
  value: string;
}

export class SocialNetwork implements FormControlOption {
  name: string;
  value: string;
  src: string;
  /**
   * The base URL for the social network's profile endpoints.
   * The URL given here will have the social network user's
   * username appended to it to form social links.
   *
   * @example
   * 'https://facebook.com'
   * // produces
   * 'https://facebook.com/my.username.here'
   */
  href: string;
  /**
   * The social network's "Call-to-action", i.e. the flavour
   * text that describes a 'subscription' to someone's profile.
   *
   * @example
   * 'Like' // or...
   * 'Follow' // etc.
   */
  cta: string;
  /**
   * An alternative for the social network's URL scheme and
   * a label to describe what the URL represents, i.e. for when
   * a network has a different URL for "company", "person", "page", etc.
   */
  options?: SocialNetworkOption[];

  constructor(params: SocialNetwork) {
    Object.assign(this, params);
  }
}

export const SocialNetworks: SocialNetwork[] = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/',
    cta: 'Like',
    value: 'fb',
    src: 'https://brand.ontariotechu.ca/apps/assets/social_icons/socialicon_facebook_2022.png'
  },
  {
    // name: '𝕏',
    name: 'X',
    href: 'https://twitter.com/',
    cta: 'Follow',
    value: 'tw',
    src: 'https://brand.ontariotechu.ca/apps/assets/social_icons/socialicon_twitter_x.png'
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/',
    cta: 'Subscribe to',
    options: [
      {
        value: 'user',
        label: 'User'
      },
      {
        value: 'channel',
        label: 'Channel'
      },
      {
        value: 'c',
        label: 'Custom'
      }
    ],
    value: 'yt',
    src: 'https://brand.ontariotechu.ca/apps/assets/social_icons/socialicon_youtube_2022.png'
  },
  {
    name: 'LinkedIn',
    cta: 'Connect with',
    href: 'https://linkedin.com/',
    options: [
      {
        value: 'in',
        label: 'Person'
      },
      {
        value: 'school',
        label: 'Educational institution'
      },
      {
        value: 'company',
        label: 'Business/company'
      },
      {
        value: 'jobs',
        label: 'Job postings'
      }
    ],
    value: 'li',
    src: 'https://brand.ontariotechu.ca/apps/assets/social_icons/socialicon_linkedin_2022.png'
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/',
    cta: 'Follow',
    value: 'in',
    src: 'https://brand.ontariotechu.ca/apps/assets/social_icons/socialicon_instagram_2022.png'
  },
  {
    name: 'TikTok',
    href: 'https://tiktok.com/@',
    cta: 'Follow',
    value: 'ti',
    src: 'https://brand.ontariotechu.ca/apps/assets/social_icons/socialicon_tiktok_2022.png'
  }
];

export const ButtonStyles: FormControlOption[] = [
  {
    value: 'button',
    name: 'Button only'
  },
  {
    value: 'both',
    name: 'Button and link'
  },
  {
    value: 'link',
    name: 'Link only'
  }
];
