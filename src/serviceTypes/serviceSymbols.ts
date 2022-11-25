const SERVICE_SYMBOLS = {
  IUsersService: Symbol.for('IUsersService'),
  IAuthService: Symbol.for('IAuthService'),
  IEmailService: Symbol.for('IEmailService'),
  IFamilyService: Symbol.for('IFamilyService'),
  IExpensesService: Symbol.for('IExpensesService'),
  IIncomesService: Symbol.for('IIncomesService'),
  ICategoriesService: Symbol.for('ICategoriesService'),
};

export { SERVICE_SYMBOLS };
