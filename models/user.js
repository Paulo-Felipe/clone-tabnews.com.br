import database from "infra/database.js";
import { ValidationError } from "infra/errors.js";

async function create(userInputValues) {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUsername(userInputValues.username);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function validateUniqueEmail(email) {
    const results = await database.query({
      text: `
            SELECT
              email
            FROM
              users
            WHERE
              LOWER(email) = LOWER($1)
            ;`,
      values: [email],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "O e-mail informado já está sendo utilizado.",
        action: "Utilize outro e-mail para realizar o cadastro.",
      });
    }
  }

  async function validateUniqueUsername(username) {
    const results = await database.query({
      text: `
            SELECT
              username
            FROM
              users
            WHERE
              LOWER(username) = LOWER($1)
            ;`,
      values: [username],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "O username informado já está sendo utilizado.",
        action: "Utilize outro username para realizar o cadastro.",
      });
    }
  }

  async function runInsertQuery({ username, email, password }) {
    const results = await database.query({
      text: `
            INSERT INTO
              users (username, email, password)
            VALUES
              ($1, $2, $3)
            RETURNING
              *
            ;`,
      values: [username, email, password],
    });

    return results.rows[0];
  }
}

const user = { create };

export default user;
