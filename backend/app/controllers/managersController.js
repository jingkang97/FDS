import moment from 'moment';

import dbQuery from '../db/dev/dbQuery';

import {
    hashPassword,
    comparePassword,
    isValidEmail,
    validatePassword,
    isEmpty,
} from '../helpers/validations';
  
import {
    errorMessage, successMessage, status,
} from '../helpers/status';

/**
   * Create A Manager
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object (of Manager)
   */
  const createManager = async (req, res) => {
    const {
      email, first_name, last_name, password,
    } = req.body;

    console.log('body: ', req.body)
    console.log('email: ', email)
    console.log('first_name: ', first_name)
    console.log('last_name: ', last_name)
    console.log('password: ', password)


    // const created_on = moment(new Date());
    if (isEmpty(email) || isEmpty(first_name) || isEmpty(last_name) || isEmpty(password)) {
      errorMessage.error = 'Email, password, first name and last name fields cannot be empty';
      return res.status(status.bad).send(errorMessage.error);
    }
    if (!isValidEmail(email)) {
      errorMessage.error = 'Please enter a valid Email';
      return res.status(status.bad).send(errorMessage.error);
    }
    if (!validatePassword(password)) {
      errorMessage.error = 'Password must be more than five(5) characters';
      return res.status(status.bad).send(errorMessage.error);
    }
    // const hashedPassword = hashPassword(password);
    const createManagerQuery = `INSERT INTO
        Manager(email, first_name, last_name, password)
        VALUES($1, $2, $3, $4)
        returning *`;
    const values = [
      email,
      first_name,
      last_name,
      password,
      // created_on,
    ];
  
    try {
      const { rows } = await dbQuery.query(createManagerQuery, values);
      const dbResponse = rows[0];
      // delete dbResponse.password;
    //   const token = generateUserToken(dbResponse.email, dbResponse.id, dbResponse.is_admin, dbResponse.first_name, dbResponse.last_name);
      successMessage.data = dbResponse;
    //   successMessage.data.token = token;
      return res.status(status.created).send(successMessage.data);
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        errorMessage.error = 'Manager with that EMAIL already exist';
        return res.status(status.conflict).send(errorMessage.error);
      }
      errorMessage.error = 'Operation was not successful';
      return res.status(status.error).send(errorMessage.error);
    }
  };
  
  /**
     * Signin
     * @param {object} req
     * @param {object} res
     * @returns {object} Manager object
     */
  const signinManager = async (req, res) => {
    const { email, password } = req.body;
    if (isEmpty(email) || isEmpty(password)) {
      errorMessage.error = 'Email or Password detail is missing';
      return res.status(status.bad).send(errorMessage.error);
    }
    if (!isValidEmail(email)) {
      errorMessage.error = 'Please enter a valid Email or Password';
      return res.status(status.bad).send(errorMessage.error);
    }
    const signinManagerQuery = 'SELECT * FROM Manager WHERE email = $1';
    try {
      const { rows } = await dbQuery.query(signinManagerQuery, [email]);
      const dbResponse = rows[0];
      if (!dbResponse) {
        errorMessage.error = 'Manager with this email does not exist';
        console.log(errorMessage);
        return res.status(status.notfound).send(errorMessage.error);
      }
      if (!comparePassword(dbResponse.password, password)) {
        errorMessage.error = 'The password you provided is incorrect';
        return res.status(status.bad).send(errorMessage.error);
      }
      // const token = generateUserToken(dbResponse.email, dbResponse.id, dbResponse.is_admin, dbResponse.first_name, dbResponse.last_name);
      // delete dbResponse.password;
      successMessage.data = dbResponse;
    //   successMessage.data.token = token;
      return res.status(status.success).send(successMessage.data);
    } catch (error) {
      errorMessage.error = 'Operation was not successful';
      return res.status(status.error).send(errorMessage.error);
    }
  };

  /**
 * @params {Object} req
 * @params {Object} res
 * @returns return firstname and Lastname
 */ 

 const searchManagerFirstnameOrLastname = async (req, res) => {
    const { first_name, last_name } = req.query;
    const searchQuery = 'SELECT * from Manager WHERE first_name =$1 OR last_name =$2 ORDER BY id DESC';
    try {
      const { rows } = await dbQuery.query(searchQuery, [first_name, last_name]);
      const dbResponse = rows;
      if (!dbResponse[0]) {
        errorMessage.error = 'No user with such names';
        return res.status(status.notfound).send(errorMessage.error);
      }
      successMessage.data = dbResponse;
      return res.status(status.success).send(successMessage.data);
    }
    catch (error) {
      errorMessage.error = 'Operation was not successful';
      return res.status(status.error).send(errorMessage.error);

    }
  };

    /**
   * Edit A manager
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object (of Customer)
   */
  const editManager = async (req, res) => {
    const {
      email, first_name, last_name, password, id
    } = req.body;

    console.log('body: ', req.body)
    console.log('email: ', email)
    console.log('first_name: ', first_name)
    console.log('last_name: ', last_name)
    console.log('password: ', password)
    console.log('id: ', id)

    if (isEmpty(email) || isEmpty(first_name) || isEmpty(last_name) || isEmpty(password)) {
      errorMessage.error = 'Email, password, first name and last name fields cannot be empty';
      return res.status(status.bad).send(errorMessage.error);
    }
    if (!isValidEmail(email)) {
      errorMessage.error = 'Please enter a valid Email';
      return res.status(status.bad).send(errorMessage.error);
    }
    if (!validatePassword(password)) {
      errorMessage.error = 'Password must be more than five(5) characters';
      return res.status(status.bad).send(errorMessage.error);
    }
    const editManagerQuery = `UPDATE Manager set
        email = $1,
        first_name = $2,
        last_name = $3,
        password = $4
        where id = $5
        returning *`;
    const values = [
      email,
      first_name,
      last_name,
      password,
      id
    ];
  
    try {
      const { rows } = await dbQuery.query(editManagerQuery, values);
      const dbResponse = rows[0];
      successMessage.data = dbResponse;
      return res.status(status.created).send(successMessage.data);
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        errorMessage.error = 'Manager with that EMAIL already exist';
        return res.status(status.conflict).send(errorMessage.error);
      }
      console.log('errorrr: ', error);
      errorMessage.error = 'Operation was not successful';
      return res.status(status.error).send(errorMessage.error);
    }
  };

  /**
   * delete a manager
   */
  const deleteManager = async (req, res) => {
    const { id } = req.body;
    const deleteRiderQuery = 'delete from manager where id = $1 returning *';
    try {
      const { rows } = await dbQuery.query(deleteRiderQuery, [id]);
      const dbResponse = rows[0];
      successMessage.data = dbResponse;
      return res.status(status.success).send(successMessage.data);
    } catch (error) {
      errorMessage.error = 'Operation was not successful';
      return res.status(status.error).send(errorMessage.error);
    }
  };
  
  export {
    createManager,
    signinManager,
    searchManagerFirstnameOrLastname,
    editManager,
    deleteManager
  };
