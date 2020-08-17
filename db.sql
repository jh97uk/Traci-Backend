CREATE TABLE customers(
    id SERIAL PRIMARY KEY,
    phoneNumber VARCHAR(50) NOT null,
    entryTimestamp TIMESTAMP NOT null,
    departureTimestamp TIMESTAMP 
    );