USE sakila;

# Q1A - Display the first and last names of all actors from the table actor.
SELECT first_name, last_name 
FROM actor;

# Q1B - Display the first and last name of each actor in a single column in upper case letters. Name the column Actor Name.
SELECT concat(first_name, ' ', last_name) AS 'Actor Name'
FROM actor;

# Q2A - You need to find the ID number, first name, and last name of an actor, of whom you know only the first name, "Joe." What is one query would you use to obtain this information?
SELECT actor_id, first_name, last_name 
FROM actor
WHERE first_name = 'Joe';

# Q2B - Find all actors whose last name contain the letters GEN:
SELECT *
FROM actor
WHERE last_name LIKE '%GEN%';

# Q2C - Find all actors whose last names contain the letters LI. This time, order the rows by last name and first name, in that order:
SELECT *
FROM actor
WHERE last_name LIKE '%LI%'
ORDER BY last_name, first_name;

# Q2D - Using IN, display the country_id and country columns of the following countries: Afghanistan, Bangladesh, and China:
SELECT country_id, country
FROM country
WHERE country IN ('Afghanistan', 'Bangladesh', 'China');

# Q3A - Add a middle_name column to the table actor. Position it between first_name and last_name. Hint: you will need to specify the data type.
ALTER TABLE actor
ADD middle_name VARCHAR (50);

# Q3B - You realize that some of these actors have tremendously long last names. Change the data type of the middle_name column to blobs.
ALTER TABLE actor
MODIFY COLUMN middle_name BLOB;

# Q3C - Now delete the middle_name column.
ALTER TABLE actor
DROP COLUMN middle_name;

# Q4A - List the last names of actors, as well as how many actors have that last name.
SELECT last_name, COUNT(last_name)
FROM actor
GROUP BY last_name;

# Q4B - List last names of actors and the number of actors who have that last name, but only for names that are shared by at least two actors.
SELECT last_name, COUNT(last_name)
FROM actor
GROUP BY last_name
HAVING COUNT(last_name) >= 1;

# Q4C - Oh, no! The actor HARPO WILLIAMS was accidentally entered in the actor table as GROUCHO WILLIAMS, the name of Harpo's second cousin's husband's yoga teacher. Write a query to fix the record.
UPDATE actor
SET first_name = 'HARPO'
WHERE first_name = 'GROUCHO' AND last_name = 'WILLIAMS';

# Q4D - Perhaps we were too hasty in changing GROUCHO to HARPO. It turns out that GROUCHO was the correct name after all! In a single query, if the first name of the actor is currently HARPO, change it to GROUCHO. Otherwise, change the first name to MUCHO GROUCHO, as that is exactly what the actor will be with the grievous error. BE CAREFUL NOT TO CHANGE THE FIRST NAME OF EVERY ACTOR TO MUCHO GROUCHO, HOWEVER! (Hint: update the record using a unique identifier.)
UPDATE actor
SET first_name = 'GROUCHO'
WHERE first_name = 'HARPO' AND last_name = 'WILLIAMS';

# Q5A - You cannot locate the schema of the address table. Which query would you use to re-create it?
SHOW CREATE TABLE address;

# Q6A - Use JOIN to display the first and last names, as well as the address, of each staff member. Use the tables staff and address:
SELECT s.first_name, s.last_name, a.address 
FROM staff s INNER JOIN address a
ON s.address_id = a.address_id;

# Q6B - Use JOIN to display the total amount rung up by each staff member in August of 2005. Use tables staff and payment.
SELECT s.first_name, s.last_name, SUM(p.amount) AS 'Sum Amount'
FROM staff s INNER JOIN payment p 
ON s.staff_id = p.staff_id
GROUP BY s.staff_id;

# Q6C - List each film and the number of actors who are listed for that film. Use tables film_actor and film. Use inner join.
SELECT f.title, f.film_id, COUNT(fa.actor_id) 
FROM film f INNER JOIN film_actor fa
ON f.film_id = fa.film_id
GROUP BY f.film_id;

# Q6D - How many copies of the film Hunchback Impossible exist in the inventory system?
SELECT f.title, i.film_id, COUNT(i.store_id) AS 'Copies'
FROM film f INNER JOIN inventory i
ON f.film_id = i.film_id
WHERE f.title = 'Hunchback Impossible';

# Q6E - Using the tables payment and customer and the JOIN command, list the total paid by each customer. List the customers alphabetically by last name:
SELECT c.customer_id, c.first_name, c.last_name, SUM(p.amount) AS 'Total Amount Paid'
FROM customer c INNER JOIN payment p 
ON c.customer_id = p.customer_id
GROUP BY c.customer_id;

# Q7A - The music of Queen and Kris Kristofferson have seen an unlikely resurgence. As an unintended consequence, films starting with the letters K and Q have also soared in popularity. Use subqueries to display the titles of movies starting with the letters K and Q whose language is English.
SELECT * 
FROM film
WHERE title LIKE 'K%' OR 'Q%' 
AND language_id IN (
	SELECT language_id
    FROM language l
    WHERE l.name = 'English'
);

# Q7B - Use subqueries to display all actors who appear in the film Alone Trip.

# Q7C - You want to run an email marketing campaign in Canada, for which you will need the names and email addresses of all Canadian customers. Use joins to retrieve this information.

# Q7D - Sales have been lagging among young families, and you wish to target all family movies for a promotion. Identify all movies categorized as famiy films.

# Q7E - Display the most frequently rented movies in descending order.

# Q7F - Write a query to display how much business, in dollars, each store brought in.

# Q7G - Write a query to display for each store its store ID, city, and country.

# Q7H - List the top five genres in gross revenue in descending order. (Hint: you may need to use the following tables: category, film_category, inventory, payment, and rental.)

# Q8A - In your new role as an executive, you would like to have an easy way of viewing the Top five genres by gross revenue. Use the solution from the problem above to create a view. If you haven't solved 7h, you can substitute another query to create a view.

# Q8B - How would you display the view that you created in 8a?

# Q8C -You find that you no longer need the view top_five_genres. Write a query to delete it.