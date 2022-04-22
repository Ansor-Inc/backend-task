CREATE DATABASE olx;
CREATE TYPE currency_option AS ENUM ('so''m', 'y.e.');
CREATE TYPE type_option AS ENUM ('jismoniy shaxs', 'biznes');
CREATE TYPE condition_type AS ENUM ('f/b', 'yangi');

CREATE TABLE categories (
    id serial primary key,
    name varchar(255) not null,
    image varchar(255),
    parent_id int references categories(id) ON DELETE CASCADE,
    depth int default 1 not null,
    date timestamptz default current_timestamp
);

CREATE TABLE products ( 
    id serial primary key,
    category_id int references categories(id) ON DELETE CASCADE,
    name varchar(255) not null,
    address varchar(255) not null,
    price int not null,
    images text not null,
    detail text not null,
    negotiation boolean not null,
    currency currency_option not null,
    type type_option not null,
    condition condition_type not null,
    created_at timestamptz default current_timestamp 
);

