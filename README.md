# Work Well 🙂

## My new project in Angular 19 / ASP.NET Core 9 webapi / Firestore (from Google Firebase) 🎉

I will create an app to help people to make pauses when they work. The solution of this problem is : Work Well !
A tool that will run in background on your browser and will tell you where you are in your day :
* If you have a planned meeting (like a daily meeting)
* When you need to go eat your lunch
* Or when you need to take a brake from your hard core computer session !

## The Stack 😎

### FrontEnd
I will use Angular 19 with Signal store for state management

### BackEnd
I will use ASP.NET Core 9 web API with the unkown Firestore (never use it before, it's an NOSQL SAAS service, so we will check that). I will also use Swagger to have a clean API's controllers.

## Run the Backend 🚀
* Open VS Code
* Get the project from my repo
* Install this C# kit from Microsoft : https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csdevkit
* In the terminal run : dotnet run
* Go to the URL : __http://localhost:5213/swagger__ to get the API specifications

 ## Notes from me 💭
 * 21/04/2025 : It's been a while since i used some C# (that i love ! Except the fact that you always need to connect with your microsof account to use the APS.NET universe...). And also will be the first time i will use Firestore. Will tell you if it's easy to use and put in place.
 * 21/04/2025 : Firestore is really easy to use ! Collections are table, Documents are line, so really easy to understand, and the Firebase package makes everything so easy to manipulate 😎
So to use Firestore for a ASP.Net core 9 webapi project you will need to :
   * Install the nuget package for Firebase : __https://cloud.google.com/dotnet/docs/reference/Google.Cloud.Firestore/latest__
   * Create a Firestore project on Google Firebase : __https://console.firebase.google.com__
   * Install google cloud cli and add dev auth (follow this document) : __https://cloud.google.com/docs/authentication/set-up-adc-local-dev-environment#local-user-cred__
After that, you are good to go !
And also Swagger is really helful to manipulate easily the API's endpoint 🙂
* 22/04/2025 : Tried to use NGrx to make some state management in Angular, but... it was so complicated for nothing :( So i used the Signal store feature (since Angular 16) that really looks like VueJS Pinia store, and i really like that !
* 24/05/2025 : I got to the end of this application, i have everything i wanted in it ! Time to pass to another project 😊
