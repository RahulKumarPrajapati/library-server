const ACCESS_CODE = {
    SUCCESS: 200,
    ENTRY_CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    DATA_NOT_FOUND: 404,
    DATA_ALREADY_PRESENT: 409,
    INTERNAL_SERVER_ERROR: 500
}
const MESSAGE = {
    user_registered_successfully: 'user_registered_successfully',
    username_already_exist: 'username_already_exist',
    user_not_found: 'user_not_found',
    invalid_password: 'invalid_password',
    login_successful: 'login_successful',
    error_registering_user: 'error_registering_user',
    error_logging_user: 'error_logging_user',
    book_added_successfully: 'book_added_successfully',
    error_adding_book: 'error_adding_book',
    book_assigned_successfully: 'book_assigned_successfully',
    book_already_assigned: 'book_already_assigned',
    error_assigning_book: 'error_assigning_book',
    book_not_exists: 'book_not_exists',
    unauthorized_user: 'unauthorized_user',
    book_returned_successfully: 'book_returned_successfully',
    error_returning_book: 'error_returning_book',
    cannot_assign_book_to_librarian: 'cannot_assign_book_to_librarian',
    error_getting_books: 'error_getting_books',
    cannot_delete_librarian: 'cannot_delete_librarian',
    user_has_borrowed_books: 'user_has_borrowed_books',
    user_deleted_successfully: "user_deleted_successfully",
    error_deleting_user: 'error_deleting_user',
    error_getting_users: 'error_getting_users',
    error_updating_user: 'error_updating_user',
    book_deleted_successfully: 'book_deleted_successfully',
    book_updated_successfully: 'book_updated_successfully',
    error_updating_book: 'error_updating_book'
}

const ROLE = {
    LIBRARIAN: 1,
    MEMBER: 2
}

module.exports = {ACCESS_CODE, MESSAGE, ROLE}