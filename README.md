# Github Readme Generator

This application automatically generates README files for your GitHub repositories.  It analyzes your repository's code and content to create a concise and informative README.md file, saving you time and effort.

## Features

* **Automated README Generation:** Analyzes your GitHub repository to generate a README.md file.
* **Code Analysis:**  Intelligently selects relevant code files for context when generating the README.
* **Markdown Support:**  Generates README files in standard markdown format.
* **Repository Tracking:**  Connect your GitHub account to track and manage your repositories within the application.
* **Commit History Integration:** Updates the README based on new commits and changes pushed to your repository.
* **Webhooks:** Uses webhooks to listen for push events on your repository and automatically update the README.
* **Error Handling and User Feedback:** Provides clear error messages and user feedback during the generation process.

## Getting Started

1. **Provide Repository URL:** Enter the URL of your GitHub repository.
2. **Generate README:** Click the "Generate README" button. The application will analyze your repository and generate a README.md file.
3. **Track Repository (Optional):** Connect your GitHub account to track the repository and enable automatic README updates on future commits.

## Technical Details

The application utilizes the following technologies:

* **Next.js:**  For building the user interface and serverless functions.
* **Google Gemini AI:** For code analysis and README generation.
* **Prisma:** For database management and interacting with the database.
* **Tailwind CSS:**  For styling the user interface.
* **React Markdown:** For rendering markdown content.
* **Axios:** For making HTTP requests.
* **JWT (JSON Web Tokens):** For secure authentication and authorization.

## Contributing

Contributions are welcome!  Please feel free to submit issues and pull requests.


## Deployment

The application is deployed on Vercel.


## License

This project is licensed under the MIT License.
