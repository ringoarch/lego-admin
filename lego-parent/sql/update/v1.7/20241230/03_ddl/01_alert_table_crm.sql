ALTER TABLE crm_contract
	DROP COLUMN TYPE_ID;

ALTER TABLE crm_customer
	DROP COLUMN TYPE_ID;

ALTER TABLE crm_lead
	DROP FOREIGN KEY FK_CRM_LEAD_TYPE,
	DROP COLUMN SOURCE_ID;
