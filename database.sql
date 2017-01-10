CREATE TABLE client (
  id SERIAL PRIMARY KEY,
  primary_contact_name VARCHAR(100),
  primary_contact_phone_number VARCHAR(20),
  primary_contact_email VARCHAR(50),
  alt_contact_name VARCHAR(100),
  alt_phone_number VARCHAR(20),
  alt_contact_email VARCHAR(50),
  billing_address_street VARCHAR(50),
  billing_address_city VARCHAR(50),
  billing_address_state VARCHAR(20),
  billing_address_zip INTEGER,
  survey_address_street VARCHAR(50),
  survey_address_city VARCHAR(50),
  survey_address_state VARCHAR(20),
  survey_address_zip INTEGER
);

CREATE TABLE survey (
  id SERIAL PRIMARY KEY,
  survey_number INTEGER,
  job_number INTEGER,
  completion_date DATE,
  survey_date DATE,
  installed_by VARCHAR(100),
  status VARCHAR(80),
  last_modified DATE,
  client_id INTEGER references client
);

CREATE TABLE images (
 id SERIAL PRIMARY KEY,
 file_name VARCHAR(100),
 bucket VARCHAR(100),
 image_key VARCHAR(100),
 survey_id INTEGER references survey
);

CREATE TABLE measurements (
  id SERIAL PRIMARY KEY,
  area VARCHAR(100),
  floor INTEGER,
  room VARCHAR(50),
  quantity INTEGER,
  width VARCHAR(25),
  length VARCHAR(25),
  mount_location VARCHAR(10),
  fasica_size INTEGER,
  controls VARCHAR(10),
  mount VARCHAR(40),
  fabric VARCHAR(100),
  notes VARCHAR(200),
  survey_id INTEGER references survey
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(100),
  can_add_user BOOLEAN,
  authorized BOOLEAN
);
