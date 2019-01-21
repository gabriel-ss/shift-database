<?php

/**
 * A simplified interface to interact with databases more easily.
 */
interface DatabaseInterface
{


	/**
	 * Searches for elements that match the filters passed as arguments and
	 * returns an array of arrays containing the fields of an element. If no
	 * element matches the filters an empty array is returned.
	 *
	 * @param  array $filters An array where each key indicate a field to be
	 * matched and the value of that key specifies the value of the field.
	 *
	 * @return array          An array of arrays, each containing the fields of
	 * an element that matches the filter.
	 */
	public function find(array $filters): array;


	/**
	 * Searches for the first element that match the filters passed as arguments
	 * and returns an array containing its fields. In case of no matches an
	 * empty array is returned.
	 *
	 * @param  array $filters An array where each key indicate a field to be
	 * matched and the value of that key specifies the value of the field.
	 *
	 * @return array          An array containing the fields of the first element
	 * that matches the filter.
	 */
	public function findOne(array $filters): array;


	/**
	 * Inserts a new element in the database with the field values specified by
	 * the array passed.
	 *
	 * @param  array $values An array where each key indicate a field to be
	 * filled and the value of that key specifies the value of the field.
	 *
	 * @return int           Number of elements affected
	 */
	public function insertOne(array $values): int;


	/**
	 * Receives an array of arrays where each one contain the information about
	 * one of the entries to be inserted. The relation of value position in the
	 * arrays contained in $values and the field in the database is defined in
	 * the $fields Array.
	 *
	 * @param  array $fields An array specifing the relation between the order of
	 * the values in the arrays in $values and the fields in the database.
	 *
	 * @param  array $values An ordered array of ordered arrays, each one
	 * containing the information of one of the entries to be inserted into the
	 * database.
	 *
	 * @return int           Number of entries affected
	 */
	public function insertMany(array $fields, array $values): int;


	/**
	 * Updates elements that match the filters with the specified values.
	 *
	 * @param  array $filters An array where each key indicate a field to be
	 * matched and the value of that key specifies the value of the field.
	 *
	 * @param  array $values  An array where each key indicate a field to be
	 * updated and the value of that key specifies the value of the field.
	 *
	 * @return int            Number of elements affected
	 */
	public function update(array $filters, array $values): int;


	/**
	 * Deletes elements that match the filters passed.
	 *
	 * @param  array $filters An array where each key indicate a field to be
	 * matched and the value of that key specifies the value of the field.
	 *
	 * @return int            Number of elements affected
	 */
	public function delete(array $filters): int;


}
