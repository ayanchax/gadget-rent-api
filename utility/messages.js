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
        updated:"User updated successfully.",
        already_verified:"User already verified",
        account_verified:"User account verified successfully.",
        password_changed:"User password changed successfully.",
        password_incorrect:"Old password entered is incorrect.",
        password_change_error:"Password could not be changed. Possible reason could be either the user does not exist or the old password you entered is incorrect. Please contact support.",
        verification_link_generated:"User verification link generated successfully.",
        verification_link_exists:"User verification link already exists.",
        no_verification_link:"No user verification link generated. Please contact support for account verification link.",
        required_fields_error:"Required user fields missing. Requird fields are userid, password,name,st_address_ln1,city,pincode, state,country,mobile_number.",
        password_error:"Password must be min 8 letters, with at least a special symbol, upper and lower case letters and a number.",
        user_id_error:"User id must be a valid email address.",
        pincode_error:"Pincode must be a 6 digit number.",
        mobile_number_error:"Phone number must be a 10 digit number.",
        object_missing_update_error:"Provide a valid object identifier to update user details.",
        not_found_error:"No User found to update.",
        no_user_found:"No User found.",
        required_fields_for_password_change_error:"Required fields for password change missing. Requird fields are oldPassword,newPassword,confirmNewPassword.",
        password_mismatch_error:"New password do not match with the confirm password."
        
    }
};
module.exports = api_messages;