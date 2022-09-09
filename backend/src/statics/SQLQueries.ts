// TODO: If time permits, make tables here as var

const contactTable = 'public.contacts';
const usersTable = 'public.users';

export const DB_GET_ALL_CONTACTS = `SELECT * FROM ${contactTable}`;
export const DB_GET_CONTACT_WITH_EMAIL = `SELECT * FROM ${contactTable} WHERE contact_email = 'emailAddress'`;
export const DB_INSERT_CONTACT = `INSERT INTO ${contactTable} (contact_email, contact_name) VALUES('emailAddress', 'contactName');`;
export const DB_UPDATE_CONTACT = `UPDATE public.contacts SET condition WHERE contact_email = 'emailAddress' `;
export const DB_DELETE_CONTACT = `DELETE FROM ${contactTable} WHERE contact_email = 'emailAddress'`;

export const DB_GET_USER_PASS = `SELECT * FROM ${usersTable} WHERE username='mailtrap-username' and "password"='mailtrap-password';`;

export const contactPatch: Readonly<Record<string, string>> = Object.freeze({
  changeEmail: "contact_email='changeEmail' ",
  changeName: "contact_name='changeName' ",
});
