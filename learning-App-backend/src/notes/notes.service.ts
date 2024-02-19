import knex from "../db/connection";
export async function addNote(
  userId: string | undefined,
  subject_id: any,
  note_content: any
) {
  console.log("inside of the notes service function called addNote");
  return knex("notes").insert({
    user_id: userId,
    note_content,
    subject_id,
  });
}
export async function getListOfNotes(
  userId: string | undefined,
  subjectId: number
) {
  return knex("notes")
    .select("note_content", "notes_id")
    .where({ user_id: userId, subject_id: subjectId });
}
