import sgMail from '@sendgrid/mail';
import logger from '../../../../core/logger.js';
import config from '../../../../core/config.js';
import sendGridTemplates, { SendGridTemplateKey } from './sendGridTemplates.js';

export default async function sendMail({ to, templateKey, dynamicTemplateData }: {
  to: string,
  templateKey: SendGridTemplateKey,
  dynamicTemplateData: unknown,
}) {
  sgMail.setApiKey(config.SENDGRID_API_KEY);
  const templateId = sendGridTemplates.get(templateKey);
  if (templateId && !to.includes('test')) {
    try {
      await sgMail.send({
        to,
        from: {
          email: config.SENDGRID_FROM_EMAIL,
          name: 'TechHustlers PH Admin',
        },
        templateId,
        dynamicTemplateData,
      });
    } catch (error) {
      logger.error(error);
    }
  } else {
    throw new Error('Template not found');
  }
}
