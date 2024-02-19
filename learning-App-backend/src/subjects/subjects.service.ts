import knex from "../db/connection";
type Subject = {
  sub: string;
  user_id: string;
};
export async function create(subject: Subject) {
  return knex("subject")
    .insert({
      subject_name: subject.sub,
      user_id: subject.user_id,
    })
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}
//check if the subject for the user exists
export async function check(id: string, subject: Subject) {
  return knex("subject")
    .select("user_id", "subject_name")
    .whereExists(
      knex.select("user_id").from("subject").whereRaw("user_id = ?", [id])
    )
    .andWhereRaw("LOWER(subject_name) = ?", [subject.sub.toLowerCase()]);
}

export async function getTheSubjects(id: string) {
  return knex("subject")
    .select("subject_name", "subject_id")
    .where({ user_id: id });
}

export async function retrieveSubId(id: string, subjectName: string) {
  return knex("subject")
    .select("subject_id")
    .where({ user_id: id, subject_name: subjectName })
    .first();
}
