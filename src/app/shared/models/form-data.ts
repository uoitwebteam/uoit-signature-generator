import { FormControlOption, SocialNetwork, SocialNetworkOption } from '.';

export interface NameData {
  first: string;
  last: string;
  pronouns: string;
}

export interface OfficeHoursData {
  hours: string;
  disconnect: boolean;
}

export interface ContactData {
  phone: string;
  ext: string;
  mobile: string;
  fax: string;
  faxext: string;
  email: string;
  website: string;
}

export interface CredentialsData {
  title: string;
  dept: string;
}

export interface SocialNetworkData {
  type: SocialNetwork;
  account: SocialNetworkOption;
  username: any;
}

export interface ImageData {
  src: string;
  alt: string;
  href: string;
  scale: number;
  width: number;
}

export interface FeatureData {
  research: boolean;
  anniversary: boolean;
}

export interface EventData {
  icon: FormControlOption;
  size: string;
  name: string;
  date: string;
  desc: string;
  cta: string;
  url: string;
}

export interface MessageData {
  style: string;
  content: string;
  brand: boolean;
  acknowledgement: boolean;
  acknowledgementImage: boolean;
}

export interface FormData {
  name: NameData;
  contact: ContactData;
  credentials: CredentialsData;
  officehours: OfficeHoursData;
  social: {
    style: FormControlOption;
    networks: SocialNetworkData[];
  };
  logo: FormControlOption;
  image: ImageData;
  feature: FeatureData;
  event: {
    use: boolean;
    data: EventData;
  };
  message: MessageData;
}
