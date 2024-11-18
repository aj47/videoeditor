describe('Video Block Editor', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('shows correct title', () => {
    cy.get('h1').should('have.text', 'Video Block Editor')
  })

  it('can upload video', () => {
    cy.get('input[type="file"]').selectFile('tests/sample.mp4')
    cy.get('video').should('be.visible')
  })

  it('processes video and shows timeline', () => {
    cy.get('input[type="file"]').selectFile('tests/sample.mp4')
    cy.get('.range').should('be.visible')
  })

  it('can navigate between blocks', () => {
    cy.get('input[type="file"]').selectFile('tests/sample.mp4')
    cy.get('.range', { timeout: 10000 }).should('be.visible')

    // Get initial state
    cy.window().then((win) => {
      const app = win.document.querySelector('#app').__vue__
      cy.log('Total blocks:', app.blocks.length)
      cy.log('Blocks:', JSON.stringify(app.blocks, null, 2))
    })

    // Check navigation buttons
    cy.get('button:contains("Next")').as('nextBtn')
    cy.get('button:contains("Previous")').as('prevBtn')

    cy.wait(500) // Wait for buttons to stabilize

    cy.get('@nextBtn').should('be.enabled')
    cy.get('@prevBtn').should('be.disabled')

    // Test navigation
    cy.get('video').then($video => {
      const initialTime = $video[0].currentTime
      cy.get('@nextBtn').click()
      cy.get('video').then($newVideo => {
        expect($newVideo[0].currentTime).to.be.greaterThan(initialTime)
      })
    })
  })

  it('can manage labels', () => {
    cy.get('input[type="file"]').selectFile('tests/sample.mp4')
    cy.get('.range').should('be.visible')

    // Open labels modal
    cy.get('button:contains("Labels")').click()

    // Check default labels
    cy.contains('to-remove').should('be.visible')
    cy.contains('misc').should('be.visible')

    // Add new label
    cy.get('input[placeholder="Enter label name"]').type('TestLabel')
    cy.get('input[maxlength="1"]').type('x')
    cy.get('button:contains("Add Label")').click()

    // Verify new label
    cy.contains('TestLabel').should('be.visible')
  })
})
