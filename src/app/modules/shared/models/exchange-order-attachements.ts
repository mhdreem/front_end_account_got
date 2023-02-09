import { AttachmentType } from "./attachment-type";

export interface ExchangeOrderAttachements {
    exchange_order_attachement_seq?: number,
    exchange_order_fk?: number,
    exchange_order?: string,
    exchange_order_attachement_id?: number,
    exchange_order_attachement_date?: Date,
    type_fk?: number,
    attachement_type?: AttachmentType,
    exchange_order_attachement_note?: string
}
