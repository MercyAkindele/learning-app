import knex from "../db/connection";
export async function addNote(
  userId: string | undefined,
  subject_id: any,
  note_content: any
) {
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
export async function editTheOriginalNote(
  userId: string | undefined,
  subject_id: number,
  notes_id: number,
  note_content: string
) {
  return knex("notes")
    .select("*")
    .where({ user_id: userId, subject_id, notes_id })
    .update({ notes_id, user_id: userId, note_content, subject_id }, "*")
    .then((upNote) => upNote[0]);
}
export async function deleteSelectedNote(
  userId: string | undefined,
  subject_id: number,
  noteId: number
) {
  return knex("notes")
    .select("*")
    .where({ user_id: userId, subject_id, notes_id: noteId })
    .del();
}
