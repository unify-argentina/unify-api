/*
 * Este módulo contiene todos los errores a enviar
 * @author Joel Márquez
 * */
'use strict';

module.exports = {
  USER_NOT_FOUND: 'User not found',
  TOKEN_VERIFICATION_FAILED: 'Error verifying json web token',
  DB_ERROR: 'Error saving on DB',
  INVALID_TYPES: "You're trying to send invalid data types",
  WRONG_PASSWORD: 'Wrong password',
  EMAIL_ALREADY_TAKEN: 'Email is already taken',
  MISSING_AUTHORIZATION: 'Please make sure your request has an Authorization header',
  TOKEN_EXPIRED: 'Token has expired',
  PARENT_CIRCLE_UNEXISTENT: "Paren't circle doesn't exists or doesn't belong to current user",
  CIRCLE_UNEXISTENT: "You are trying to find a circle that doesn't belong to you",
  CONTACT_UNEXISTENT: "You are trying to find a contact that doesn't belong to you",
  UNABLE_FIND_CONTACTS: 'Could not find contacts for specified circle',
  MAIN_CIRCLE_UNMODIFIABLE: "Main circle can't be modified",
  MAIN_CIRCLE_UNDELETABLE: 'Cannot delete users main circle',
  CIRCLE_REMOVE_ERROR: 'Error removing circle',
  CONTACT_REMOVE_ERROR: 'Error removing contact',
  UNABLE_FIND_SUBCIRCLES: 'Could not find subcircles for specified circle',
  CIRCLE_WITHOUT_CONTACTS: 'No contacts found for circle',
  CIRCLE_MEDIA_ERROR: 'There was an error obtaining circle media',
  CONTACT_MEDIA_ERROR: 'There was an error obtaining contact media',
  USER_MEDIA_ERROR: 'There was an error obtaining user media',
  FACEBOOK_ACCOUNT_UNLINKED: 'You have to link your facebook account in order to create a contact with a facebook_id',
  TWITTER_ACCOUNT_UNLINKED: 'You have to link your twitter account in order to create a contact with a twitter_id',
  INSTAGRAM_ACCOUNT_UNLINKED: 'You have to link your instagram account in order to create a contact with a instagram_id',
  UNABLE_FIND_DIFFERENT_USER: 'You are trying to find a different user',
  UNABLE_FIND_USER_FRIENDS: 'There was an error obtaining user friends',

  SOCIAL_INVALID_ACCESS_TOKEN: 'Access token for %s is invalid',
  SOCIAL_REACHED_API_LIMIT: "You've reached the limit of requests for %s",
  SOCIAL_ERROR: 'There whas an error with your %s account',

  FACEBOOK_UNAUTHORIZED_CODE: 190,
  INSTAGRAM_UNAUTHORIZED_CODE: 400,
  TWITTER_UNAUTHORIZED_CODE: 89
};