import { model, Schema } from 'mongoose';
import { ANALYTICS_EVENT_TYPE_VALUES } from '../api/entities/_enums.js';
import { DbComment } from './_types.js';

const AnalyticsEventSchema = new Schema(
  {
    accountId: { type: Schema.Types.ObjectId },
    ipAddress: { type: String },
    appId: { type: Schema.Types.ObjectId },
    type: {
      type: String,
      required: true,
      enum: ANALYTICS_EVENT_TYPE_VALUES,
    },
  },
  {
    collection: 'AnalyticsEvent', timestamps: true,
  },
);

const MAnalyticsEvent = model<DbComment>('AnalyticsEvent', AnalyticsEventSchema);

export default MAnalyticsEvent;
