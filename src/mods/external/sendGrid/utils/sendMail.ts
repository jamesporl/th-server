import config from 'core/config';
import sgMail from '@sendgrid/mail';
import logger from 'core/logger';
import sendGridTemplates from './sendGridTemplates';

export default async function sendMail({ to, templateKey, dynamicTemplateData }: {
  to: string,
  templateKey: string,
  dynamicTemplateData: unknown,
}) {
  sgMail.setApiKey(config.SENDGRID_API_KEY);
  const templateId = sendGridTemplates.get(templateKey);
  if (templateId) {
    try {
      await sgMail.send({
        to,
        from: config.SENDGRID_FROM_EMAIL,
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
