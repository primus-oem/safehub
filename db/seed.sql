-- Seed companies
INSERT INTO companies (name) VALUES ('CompanyA'), ('CompanyB');

-- Seed users
INSERT INTO users (email, name, company_id, role) VALUES
  ('alice@a.com', 'Alice', 1, 'manager'),
  ('bob@a.com', 'Bob', 1, 'user'),
  ('carol@b.com', 'Carol', 2, 'manager'),
  ('dave@b.com', 'Dave', 2, 'user');

-- Seed documents
INSERT INTO documents (title, content, company_id) VALUES
  ('DocA1', 'Content A1', 1),
  ('DocA2', 'Content A2', 1),
  ('DocB1', 'Content B1', 2),
  ('DocB2', 'Content B2', 2);
