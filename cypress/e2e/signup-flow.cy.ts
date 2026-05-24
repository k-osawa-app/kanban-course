describe('KanBan-Course Task Flow', () => {
  beforeEach(() => {
    // テスト前にログインページへ
    cy.visit('/signup');
  });
   it('allows a user to signup', () => {
    // 1. サインアップ処理
    cy.get('input[formControlName="name"]').type('Yamada');
    cy.get('input[formControlName="email"]').type('test222@yamada.com');
    cy.get('input[formControlName="password"]').type('123456');
    cy.get('button[type="submit"]').click();

     // 2. ダッシュボード遷移の確認
    cy.url().should('include', '/dashboard');
    cy.contains('ダッシュボード（マイボード一覧）').should('be.visible');

    });
});