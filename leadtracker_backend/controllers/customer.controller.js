import connection from '../models/db.js';

// export const addcustomer = async (req, res) => {
//  const { customer, company_name, customer_website_link } = req.body;
//  console.log(req.body, "boddy")

//  // Input validation
//  if (!company_name) {
//   return res.status(400).json({
//    success: false,
//    message: "Customer name and company name are required",
//   });
//  }

//  // Generate unique customer ID
//  const random_number = Math.floor(Math.random() * 100000 + 1);
//  const customer_id = `${customer}ns3tech${random_number}`;

//  let pool;

//  try {
//   pool = await connection.getConnection();

//   const insertSql = `
//       INSERT INTO customers (customer, company_name, customer_id, customer_website_link)
//       VALUES (?, ?, ?, ?)
//     `;
//   const values = [customer, company_name, customer_id, customer_website_link];

//   // console.log("Starting DB insert...");

//   const [results] = await pool.execute(insertSql, values);

//   // console.log("DB insert done");

//   return res.status(200).json({
//    success: true,
//    message: "Customer added successfully",
//    customer_id, // Optional: return the generated ID if needed on frontend
//    results,
//   });

//  } catch (error) {
//   console.error("Error adding customer:", error);
//   return res.status(500).json({
//    success: false,
//    message: "Internal server error. Please try again later.",
//   });

//  } finally {
//   if (pool) pool.release(); // Always release the pool if it was acquired
//  }
// };

export const addcustomer = async (req, res) => {
  const { customer, company_name, customer_website_link } = req.body;
  console.log(req.body, "body");

  // Input validation
  if (!customer || !company_name) {
    return res.status(400).json({
      success: false,
      message: "Customer name and company name are required",
    });
  }

  let pool;

  try {
    pool = await connection.getConnection();

    // ✅ Step 1: Check for duplicate customer by name and company
    const [duplicateCheck] = await pool.execute(
      `SELECT * FROM customers WHERE customer = ? AND company_name = ?`,
      [customer, company_name]
    );

    if (duplicateCheck.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Duplicate customer. This customer and company already exist.",
        existingCustomer: duplicateCheck[0]
      });
    }

    // ✅ Step 2: Generate unique customer_id
    const prefix = `${customer}_ns3tech_`;
    const [rows] = await pool.execute(
      `SELECT customer_id FROM customers 
       WHERE customer_id LIKE CONCAT(?, '%') 
       ORDER BY customer_id DESC 
       LIMIT 1`,
      [prefix]
    );

    let newNumber = 1;

    if (rows.length > 0) {
      const lastId = rows[0].customer_id;
      const match = lastId.match(/_(\d+)$/);
      if (match) {
        newNumber = parseInt(match[1], 10) + 1;
      }
    }

    const customer_id = `${prefix}${String(newNumber).padStart(3, "0")}`;

    // ✅ Step 3: Insert the new customer
    const insertSql = `
      INSERT INTO customers (customer, company_name, customer_id, customer_website_link)
      VALUES (?, ?, ?, ?)
    `;
    const values = [customer, company_name, customer_id, customer_website_link];

    const [results] = await pool.execute(insertSql, values);

    return res.status(200).json({
      success: true,
      message: "Customer added successfully",
      customer_id,
      results,
    });

  } catch (error) {
    console.error("Error adding customer:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  } finally {
    if (pool) pool.release();
  }
};



export const getAllCustomer = async (req, res, next) => {
 try {
  const pool = await connection.getConnection();
  const [rows] = await pool.query('select * from customers');
  return res.status(200).json({
   message: 'all customers data',
   success: true,
   error: false,
   rows
  })

 } catch (error) {
  console.log(error);
  res.status(500).json({
   message: "Internal server error",
   error: true,
   success: false
  })
 }

}
