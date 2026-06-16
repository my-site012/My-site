export interface ProfileBio {
  name: string;
  bio: string;
}

export interface CitySEOContent {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  h1: string;
  heroSubtext: string;
  introHeading: string;
  introText: string;
  whyChooseHeading: string;
  whyChooseText: string;
  typesHeading: string;
  typesText: string;
  bookingHeading: string;
  bookingText: string;
  areasHeading: string;
  areasText: string;
  rateHeading: string;
  rateIntro: string;
  privacyHeading: string;
  privacyText: string;
  faqHeading: string;
  faqs: { q: string; a: string }[];
  hindiText: string;
  profiles: ProfileBio[];
}

export const cityContentData: Record<string, CitySEOContent> = {};
