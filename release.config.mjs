/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ['main', 'beta'],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          { type: 'breaking', release: 'major' },
          { type: 'feature', release: 'minor' },
          { type: 'refactor', release: 'patch' },
          { type: 'fix', release: 'patch' },
          { type: 'dependabot', release: 'patch' },
          { type: 'ci', release: false },
          { type: 'test', release: false },
          { type: 'docs', release: false }
        ]
      }
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            { type: 'breaking', section: '💥 Breaking Changes' },
            { type: 'feature', section: '✨ Features' },
            { type: 'refactor', section: '♻️ Refactoring' },
            { type: 'fix', section: '🐛 Bug Fixes' },
            { type: 'ci', section: '⚙️ CI Changes' },
            { type: 'dependabot', section: '📦 Dependencies' },
            { type: 'test', section: '✅ Tests' },
            { type: 'docs', section: '📝 Documentation' }
          ]
        }
      }
    ],
    '@semantic-release/github',
    '@semantic-release/npm',
    [
      '@semantic-release/exec',
      {
        successCmd: `
          echo "Tag is: \${nextRelease.gitTag}"
          git tag -f \$(echo \${nextRelease.gitTag} | cut -d. -f1)
          git tag -f \$(echo \${nextRelease.gitTag} | cut -d. -f1-2)
          git push origin \$(echo \${nextRelease.gitTag} | cut -d. -f1) --force
          git push origin \$(echo \${nextRelease.gitTag} | cut -d. -f1-2) --force
        `
      }
    ]
  ]
}
