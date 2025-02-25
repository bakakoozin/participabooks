import pool from "../config/db.js";

class Shelf {

//============================== SELECT =======================================//

static async findAll() {}



//============================== INSERT =======================================//

static async insertVolume({ users_id, volumes_id }) {
    const INSERT_VOLUME = 
      `INSERT INTO shelfs (users_id, volumes_id) VALUES (?, ?)`;
      return await pool.execute(INSERT_VOLUME, [users_id, volumes_id]);
  }

//============================== DELETE =======================================//

static async deleteVolume({ users_id, volumes_id }) {
    const DELETE_VOLUME = `DELETE FROM shelfs WHERE users_id = ? AND volumes_id = ?`;
    return await pool.execute(DELETE_VOLUME, [users_id, volumes_id]);
}

}
export default Shelf;