const SERVICE_SYMBOLS = {
  IUsersService: Symbol.for('IUsersService'),
  IAuthService: Symbol.for('IAuthService'),
  IEmailService: Symbol.for('IEmailService'),
  IFamilyService: Symbol.for('IFamilyService'),
  IExpensesService: Symbol.for('IExpensesService'),
  ICategoriesService: Symbol.for('ICategoriesService'),
  ISubscriptionsService: Symbol.for('ISubscriptionsService'),
};

export { SERVICE_SYMBOLS };
