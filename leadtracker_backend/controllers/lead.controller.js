import connection from "../models/db.js";

// ✅ Add a new lead
export const addLead = async (req, res) => {
  console.log(req.body, "Received lead data");

  try {
    const {
      name, email, phone, company_name, country, state, city,
      website_link, industry_type, lead_status, lead_owner, date,
      description, useremail
    } = req.body;

    const pool = await connection.getConnection();

    try {
      // Step 1: Check for duplicate leads
      const checkSql = `
        SELECT * FROM marketingleads 
        WHERE (email = ? AND company_name = ?) OR phone = ?
      `;
      const [existingLeads] = await pool.execute(checkSql, [email, company_name, phone]);

      if (existingLeads.length > 0) {
        return res.status(409).json({ message: 'Duplicate lead: lead already exists' });
      }

      // Step 2: Insert new lead
      const insertSql = `
        INSERT INTO marketingleads
        (name, email, phone, company_name, country, state, city,
         website_link, industry_type, lead_status, lead_owner, date,
         description, useremail)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        name, email, phone, company_name, country, state, city,
        website_link, industry_type, lead_status, lead_owner, date,
        description, useremail
      ];

      const [result] = await pool.execute(insertSql, values);

      return res.status(201).json({
        message: 'Lead added successfully',
        leadId: result.insertId
      });

    } finally {
      pool.release();
    }

  } catch (error) {
    console.error('Error adding lead:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Get all leads
export const getAllLeads = async (req, res) => {
  try {
    const pool = await connection.getConnection();
    try {
      const [rows] = await pool.query('SELECT * FROM marketingleads ORDER BY id DESC');
      res.json(rows);
    } finally {
      pool.release();
    }
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Get leads by user email
export const getLeadbyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const pool = await connection.getConnection();
    try {
      const [rows] = await pool.query('SELECT * FROM marketingleads WHERE useremail = ?', [email]);
      res.json(rows);
    } finally {
      pool.release();
    }

  } catch (error) {
    console.error('Error fetching lead by email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Update lead
export const updateLead = async (req, res) => {
  const id = req.params.id;
  const fields = req.body;

  if (!id) return res.status(400).json({ message: 'Lead ID is required' });

  try {
    const pool = await connection.getConnection();
    try {
      const updates = [];
      const values = [];

      for (const [key, value] of Object.entries(fields)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }

      values.push(id); // WHERE condition

      const sql = `UPDATE marketingleads SET ${updates.join(', ')} WHERE id = ?`;
      await pool.execute(sql, values);

      res.json({ message: 'Lead updated successfully' });

    } finally {
      pool.release();
    }

  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Delete lead by ID
export const deleteLeadbyId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Lead ID is required' });

    const pool = await connection.getConnection();
    try {
      await pool.execute('DELETE FROM marketingleads WHERE id = ?', [id]);
      res.json({ message: 'Lead deleted successfully' });
    } finally {
      pool.release();
    }

  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};





// import connection from "../models/db.js";


// // add leads
// export const addLead = async (req, res) => {
//   console.log(req.body, "Received lead data");

//   try {
//     const {
//       name, email, phone, company_name, country, state, city,
//       website_link, industry_type, lead_status, lead_owner, date,
//       description, useremail
//     } = req.body;

//     // ✅ Step 1: Check for duplicate by email+company or phone
//     const checkSql = `
//       SELECT * FROM marketingleads 
//       WHERE (email = ? AND company_name = ?) OR phone = ?
//     `;
//     const [existingLeads] = await connection.promise().execute(checkSql, [email, company_name, phone]);

//     if (existingLeads.length > 0) {
//       return res.status(409).json({ message: 'Duplicate lead: lead already exists' });
//     }

//     // ✅ Step 2: Insert new lead
//     const insertSql = `
//       INSERT INTO marketingleads
//       (name, email, phone, company_name, country, state, city,
//        website_link, industry_type, lead_status, lead_owner, date,
//        description, useremail)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const values = [
//       name, email, phone, company_name, country, state, city,
//       website_link, industry_type, lead_status, lead_owner, date,
//       description, useremail
//     ];

//     const [result] = await connection.promise().execute(insertSql, values);

//     return res.status(201).json({ 
//       message: 'Lead added successfully', 
//       leadId: result.insertId   
//     });

//   } catch (error) {
//     console.error('Error adding lead:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };



// // get all leads
// export const getAllLeads = async (req, res) => {

//   try {
//     const [rows] = await connection.promise().query('SELECT * FROM marketingleads ORDER BY id DESC');
//     res.json(rows);
//   } catch (error) {
//     console.error('Error fetching leads:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// // get all lead by email for each user
// export const getLeadbyEmail = async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) return res.status(400).json({ message: 'Email is required' });

//     const [rows] = await connection.promise().query('SELECT * FROM marketingleads WHERE useremail = ?', [email]);
//     res.json(rows);
//   } catch (error) {
//     console.error('Error fetching lead by email:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// // update lead
// export const updateLead = async (req, res) => {
//   const id = req.params.id;
//   console.log(req.body, "=====",id,"======id");
//   try {
//     const {...fields } = req.body;
//     if (!id) return res.status(400).json({ message: 'Lead ID is required' });

//     const updates = [];
//     const values = [];

//     for (const [key, value] of Object.entries(fields)) {
//       updates.push(`${key} = ?`);
//       values.push(value);
//     }

//     values.push(id); // for WHERE id = ?

//     const sql = `UPDATE marketingleads SET ${updates.join(', ')} WHERE id = ?`;
//     await connection.promise().execute(sql, values);

//     res.json({ message: 'Lead updated successfully' });
//   } catch (error) {
//     console.error('Error updating lead:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


// // delete lead by IDexport const deleteLeadbyId = async (req, res) => {
// export const deleteLeadbyId = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log("Deleting lead with ID:", id);
//     if (!id) return res.status(400).json({ message: 'Lead ID is required' });

//     await connection.promise().execute('DELETE FROM marketingleads WHERE id = ?', [id]);

//     res.json({ message: 'Lead deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting lead:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
