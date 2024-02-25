import knex from "../db/connection";
type Subject = {
  subject: string;
  user_id: string | undefined;
};

export async function create(userSubject: Subject) {
  return knex("pomodoro")
    .insert({
      subject: userSubject.subject,
      user_id: userSubject.user_id,
    })
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}
