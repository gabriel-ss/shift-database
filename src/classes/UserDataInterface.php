<?php

/**
 * Adds an extra abstraction layer over the DatabaseInterface. The constants
 * defined here are used to identify each field of a user entry in the database,
 * thus making the data management completely independent of the implementation.
 *
 * The use of the functions defined in the DatabaseInterface must be exclusively
 * through the use of constants defined here as keys for all parameters that
 * receive arrays. The info from the returned arrays can also be retrieved by
 * using the constants
 */
interface UserDataInterface extends DatabaseInterface
{
	const ID = 0;
	const EMAIL = 1;
	const NAME = 2;
	const PASSWORD = 3;
	const ACCESS_LEVEL = 4;
}
