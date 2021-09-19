const api_messages = {
    AMBIGIOUS: "User Input Blank or Null or ambigious.",
    SUPPLY_VALID_IDENTIFIER: "Supply a valid identifier.",
    NO_SEARCH_RESULTS: "No search results found.",
    ERROR: "Error occured.",
    OPERATION_FAILED: "Operation failed. Please try again or contact support if problem persists.",
    PING_OK:"You have succesfully pinged the G-rent API service application end.",
    CONNECTION_OK:"You have succesfully connected to the G-rent API service database end.",
    CONNECTION_FAILED:"Failed to connect to the G-rent API service database end.",
    USER:{
        created:"User created successfully.",
        required_fields_error:"Required user fields missing. Requird fields are userid, password,st_address_ln1,city,pincode, state,country,mobile_number.",
    }
};
module.exports = api_messages;