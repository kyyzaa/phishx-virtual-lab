const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

(async () => {
  try {
    console.log('🔍 Checking database tables...');
    
    // Check if tables exist
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('📋 Tables found in database:');
    if (result.rows.length === 0) {
      console.log('  ❌ No tables found! Migration may have failed.');
    } else {
      result.rows.forEach(row => console.log('  ✓', row.table_name));
    }
    
    // Check users table structure if it exists
    if (result.rows.some(row => row.table_name === 'users')) {
      const usersStructure = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        ORDER BY ordinal_position;
      `);
      
      console.log('\n👤 Users table structure:');
      usersStructure.rows.forEach(row => {
        console.log(`  - ${row.column_name} (${row.data_type})`);
      });
    }
    
    // Check quiz_results table structure if it exists
    if (result.rows.some(row => row.table_name === 'quiz_results')) {
      const quizStructure = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'quiz_results' 
        ORDER BY ordinal_position;
      `);
      
      console.log('\n📝 Quiz_results table structure:');
      quizStructure.rows.forEach(row => {
        console.log(`  - ${row.column_name} (${row.data_type})`);
      });
    }
    
    await pool.end();
    console.log('\n✅ Database verification completed!');
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }
})();