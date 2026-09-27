// Shared by the contact form (client) and its server action
export type ContactData = {
  name: string;
  email: string;
  idea: string;
  company: string;
  website: string; // honeypot
};

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MAX_SHORT = 200;
export const MAX_IDEA = 5000;
