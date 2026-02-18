# User Self Service Import
For customers that use a self service portal (f.e. Koblenz) for card creation, entitled users can create their own card.
The list of entitled users can be uploaded by the customer using this endpoint:
http://localhost:8000/users/import

1. Create an api token as project admin, since the access to the endpoint is restricted.
2. Use the provided csv file in `administration/resources/self-service`.
3. If you want to create your own data, you can hash it according to [create-koblenz-hash](./create-koblenz-hash.md). The easiest way is to debug in `Argon2IdHasherTest` using your own birthday and reference number.
4. Upload the csv via curl or postman.

### Note: 
- Ensure `Content-Type: multipart/form-data` for the header
- `file` (key) and your csv file for the body

### Example:
```
curl -X POST http://localhost:8000/users/import \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@./import_userentitlements.csv" \
  -w "\nStatus: %{http_code}\n"
```
