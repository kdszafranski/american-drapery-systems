CREATE TABLE client (
  id SERIAL PRIMARY KEY,
  client_name VARCHAR(100),
  primary_contact_name VARCHAR(100),
  primary_contact_phone_number VARCHAR(30),
  primary_contact_email VARCHAR(50),
  alt_contact_name VARCHAR(100),
  alt_phone_number VARCHAR(30),
  alt_contact_email VARCHAR(50),
  billing_address_street VARCHAR(50),
  billing_address_city VARCHAR(50),
  billing_address_state VARCHAR(30),
  billing_address_zip VARCHAR(10)
);

CREATE TABLE survey (
  id SERIAL PRIMARY KEY,
  job_number INTEGER,
  completion_date DATE,
  survey_date DATE,
  installed_by VARCHAR(100),
  status VARCHAR(80),
  last_modified DATE,
  client_id INTEGER references client,
  address_street VARCHAR(80),
  address_city VARCHAR(80),
  address_state VARCHAR(80),
  address_zip VARCHAR(80)
);

CREATE TABLE areas (
  id SERIAL PRIMARY KEY,
  area_name VARCHAR(80),
  notes VARCHAR,
  survey_id INTEGER references survey
);

CREATE TABLE files (
 id SERIAL PRIMARY KEY,
 file_info VARCHAR(100),
 bucket VARCHAR(100),
 key VARCHAR(100),
 area_id INTEGER references survey,
 original_name TEXT
);

CREATE TABLE measurements (
  id SERIAL PRIMARY KEY,
  floor VARCHAR(40),
  room VARCHAR(50),
  quantity VARCHAR(12),
  width VARCHAR(25),
  length VARCHAR(25),
  ib_ob VARCHAR(20),
  fascia_size VARCHAR(50),
  controls VARCHAR(20),
  mount VARCHAR(40),
  fabric VARCHAR(100),
  area_id INTEGER references areas
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(100),
  can_add_user BOOLEAN,
  can_edit_users BOOLEAN,
  authorized BOOLEAN
);
