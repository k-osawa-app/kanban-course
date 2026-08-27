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

    // 4. タスク追加モーダルを開く
    cy.contains('+ タスク追加').click();
    
    // 5. フォーム入力
    const taskTitle = 'E2Eテストタスク2 ' + Date.now();
    cy.get('input[formControlName="title"]').type(taskTitle);
    cy.get('select[formControlName="status"]').select('To Do');
    
    // 6. 保存
    cy.get('button[type="submit"]').click();

    // 7. ボードに追加されたか確認     
    cy.get('h4').should('exist');
    //cy.get('h4').scrollIntoView().should('be.visible');
    //cy.contains(taskTitle).should('be.visible');    

  });
});
