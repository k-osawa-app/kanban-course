describe('KanBan-Course Task Flow', () => {
  beforeEach(() => {
    // テスト前にログインページへ
    cy.visit('/login');
  });

  it('allows a user to login and create a task', () => {
    // 1. ログイン処理
    // 注: 本来はテスト用コマンドでAPI経由ログインをするのがベストですが、
    // ここではUI操作をシミュレートします。
    cy.get('input[formControlName="email"]').type('test@kanban.com');
    cy.get('input[formControlName="password"]').type('123456');
    cy.get('button[type="submit"]').click();

    // 2. ダッシュボード遷移の確認
    cy.url().should('include', '/dashboard');
    cy.contains('ダッシュボード（マイボード一覧）').should('be.visible');

    // 3. ボードを選択
    cy.contains('事務所内作業').click();

    
    // 2. ダッシュボード遷移の確認
     cy.contains('← ダッシュボードへ戻る').click();   
     cy.contains('ダッシュボード（マイボード一覧）').should('be.visible');

  });
});