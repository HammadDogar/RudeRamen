const ROLEID = {
  CUSTOMER: 101,
  ADMIN: 102,
};

const ORDER_STATUS_IDS = {
  NEW_ORDER: 200,
  CONFIRM_ORDER: 201,
  READY_TO_PICK_UP: 202,
  PICKED_UP: 203,
};

const ORDER_STATUS_WITH_LABELS = {
  NEW_ORDER: 'new-oder',
  CONFIRM_ORDER: 'confirm-order',
  READY_TO_PICK_UP: 'ready-to-pickup',
  PICKED_UP: 'picked-up',
};

const MESSAGES = {
  GENERIC_REQUIRED_FIELD: 'This field is required',
  BOWL_IMAGE_REQUIRED_FIELD: 'Bowl Picture is required',
  PASSWORD_MATCH_ERROR_MESSAGE:
    'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
  NEGATIVE_NUMBER_VALIDATION: 'The number must be greater than 0',
  UPDATED_SUCCESSFULLY_MESSAGE: 'Changes has been updated successfully',
};

const PASSWORD_MATCH_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const SPACE_NOT_ALLOWED_REGEX = '[A-Za-z]+';
const SPACE_NOT_ALLOWED_NUMBER_REGEX = '[0-9]+';

const PHONE_NUMBER_REGEX =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export {
  ROLEID,
  MESSAGES,
  PASSWORD_MATCH_REGEX,
  PHONE_NUMBER_REGEX,
  SPACE_NOT_ALLOWED_REGEX,
  SPACE_NOT_ALLOWED_NUMBER_REGEX,
  ORDER_STATUS_IDS,
  ORDER_STATUS_WITH_LABELS,
};
