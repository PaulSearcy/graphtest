export const type = `
  
  type Employee {
    _id: String
    emp_no: Int
    birth_date: Int
    first_name: String
    last_name: String
    gender: String
    hire_date: Int
  }

  type EmployeeQueryResults {
    Employees: [Employee!]!
    Meta: QueryResultsMetadata!
  }

  type EmployeeSingleQueryResult {
    Employee: Employee
  }

  type EmployeeMutationResult {
    Employee: Employee
    success: Boolean!
    Meta: MutationResultInfo!
  }

  type EmployeeMutationResultMulti {
    Employees: [Employee]
    success: Boolean!
    Meta: MutationResultInfo!
  }

  type EmployeeBulkMutationResult {
    success: Boolean!
    Meta: MutationResultInfo!
  }

  input EmployeeInput {
    _id: String
    emp_no: Int
    birth_date: Int
    first_name: String
    last_name: String
    gender: String
    hire_date: Int
  }

  input EmployeeMutationInput {
    emp_no: Int
    emp_no_INC: Int
    emp_no_DEC: Int
    birth_date: Int
    birth_date_INC: Int
    birth_date_DEC: Int
    first_name: String
    last_name: String
    gender: String
    hire_date: Int
    hire_date_INC: Int
    hire_date_DEC: Int
  }

  input EmployeeSort {
    _id: Int
    emp_no: Int
    birth_date: Int
    first_name: Int
    last_name: Int
    gender: Int
    hire_date: Int
  }

  input EmployeeFilters {
    _id: String
    _id_ne: String
    _id_in: [String]
    _id_nin: [String]
    emp_no_lt: Int
    emp_no_lte: Int
    emp_no_gt: Int
    emp_no_gte: Int
    emp_no: Int
    emp_no_ne: Int
    emp_no_in: [Int]
    emp_no_nin: [Int]
    birth_date_lt: Int
    birth_date_lte: Int
    birth_date_gt: Int
    birth_date_gte: Int
    birth_date: Int
    birth_date_ne: Int
    birth_date_in: [Int]
    birth_date_nin: [Int]
    first_name_contains: String
    first_name_startsWith: String
    first_name_endsWith: String
    first_name_regex: String
    first_name: String
    first_name_ne: String
    first_name_in: [String]
    first_name_nin: [String]
    last_name_contains: String
    last_name_startsWith: String
    last_name_endsWith: String
    last_name_regex: String
    last_name: String
    last_name_ne: String
    last_name_in: [String]
    last_name_nin: [String]
    gender_contains: String
    gender_startsWith: String
    gender_endsWith: String
    gender_regex: String
    gender: String
    gender_ne: String
    gender_in: [String]
    gender_nin: [String]
    hire_date_lt: Int
    hire_date_lte: Int
    hire_date_gt: Int
    hire_date_gte: Int
    hire_date: Int
    hire_date_ne: Int
    hire_date_in: [Int]
    hire_date_nin: [Int]
    OR: [EmployeeFilters]
  }
  
`;

export const mutation = `

  createEmployee (
    Employee: EmployeeInput
  ): EmployeeMutationResult

  updateEmployee (
    _id: String,
    Updates: EmployeeMutationInput
  ): EmployeeMutationResult

  updateEmployees (
    _ids: [String],
    Updates: EmployeeMutationInput
  ): EmployeeMutationResultMulti

  updateEmployeesBulk (
    Match: EmployeeFilters,
    Updates: EmployeeMutationInput
  ): EmployeeBulkMutationResult

  deleteEmployee (
    _id: String
  ): DeletionResultInfo

`;

export const query = `

  allEmployees (
    _id: String,
    _id_ne: String,
    _id_in: [String],
    _id_nin: [String],
    emp_no_lt: Int,
    emp_no_lte: Int,
    emp_no_gt: Int,
    emp_no_gte: Int,
    emp_no: Int,
    emp_no_ne: Int,
    emp_no_in: [Int],
    emp_no_nin: [Int],
    birth_date_lt: Int,
    birth_date_lte: Int,
    birth_date_gt: Int,
    birth_date_gte: Int,
    birth_date: Int,
    birth_date_ne: Int,
    birth_date_in: [Int],
    birth_date_nin: [Int],
    first_name_contains: String,
    first_name_startsWith: String,
    first_name_endsWith: String,
    first_name_regex: String,
    first_name: String,
    first_name_ne: String,
    first_name_in: [String],
    first_name_nin: [String],
    last_name_contains: String,
    last_name_startsWith: String,
    last_name_endsWith: String,
    last_name_regex: String,
    last_name: String,
    last_name_ne: String,
    last_name_in: [String],
    last_name_nin: [String],
    gender_contains: String,
    gender_startsWith: String,
    gender_endsWith: String,
    gender_regex: String,
    gender: String,
    gender_ne: String,
    gender_in: [String],
    gender_nin: [String],
    hire_date_lt: Int,
    hire_date_lte: Int,
    hire_date_gt: Int,
    hire_date_gte: Int,
    hire_date: Int,
    hire_date_ne: Int,
    hire_date_in: [Int],
    hire_date_nin: [Int],
    OR: [EmployeeFilters],
    SORT: EmployeeSort,
    SORTS: [EmployeeSort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int
  ): EmployeeQueryResults!

  getEmployee (
    _id: String
  ): EmployeeSingleQueryResult!

`;
