Release checklist
=================

1. Ensure clean working tree
   - git status should be clean
   - npm test should pass

2. Update version
   - Choose a semver bump: patch/minor/major
   - Update package.json "version"

3. Verify package contents
   - Only include necessary files ("files" in package.json)
   - Confirm README.md and LICENSE are present (optional but recommended)

4. Build/validate (if applicable)
   - Not required for this plugin (source is publishable)

5. Dry run (optional)
   - npm pack
   - Inspect the generated tarball contents

6. Publish
   - npm publish --access public

7. Tag and push
   - git tag vX.Y.Z
   - git push --tags

8. Announce / changelog
   - Create a GitHub release note or CHANGELOG entry


