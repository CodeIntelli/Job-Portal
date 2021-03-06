# Job Portal Project 

```JavaScript
@Attribute:-  DatabaseField

@Model:- Company Model:-

@Params: name
@Params: companyEmail
@Params: companyPANCard
@Params: companyPassword
@Params: profilePicture
@Params: verified
@Params: role
@Params: establishAt
@Params: bio
@Params: phone
@Params: createdAt
@Params: companyIp
@Params: companyLocation

@Model:- Job Model:-

@Params: companyId
@Params: jobTitle
@Params: jobDesc
@Params: maxApplicant
@Params: maxPosition
@Params: activeApplicant
@Params: acceptedCandidate
@Params: dateOfPosting
@Params: dueDate
@Params: skills
@Params: jobType
@Params: salary
@Params: duration
@Params: applyUrl

@Model:- Question Model:-

@Params: jobId
@Params: companyId
@Params: questions

@Model:- Answer Model:-

@Params: questionId
@Params: companyId
@Params: userId
@Params: answers


[ + ] Request Method 
🔴 Delete
🟡 Update Put/Patch
🟢 GET
🔵 POST

[ . ] Routes
~ FileName:-  UserAuthRoutes (api/v1/user/auth)
* /register  method:- registerUser
* /users/:id/verify/:token  method:- verifyEmail
* /login  method:- login
* /password/forgot  method:- forgotPassword
* /password/reset/:token  method:- resetPassword
* /logout  method:- logout

~ FileName:- UserRoutes (api/v1/user)
* /profile   method:- getUserDetails
* /changePassword  method:- updatePassword
* /edit_profile  method:- updateUserDetails
* /admin  method:- GetAllUserList
* /admin/user/:id  method:- getSingleUser
* /admin/user/:id  method:- updateUserRole
* /admin/user/:id  method:- removeUser

~ FileName:- CompanyRoutes (api/v1/company)
* /profile   method:- getLoginCompanyDetails
* /changePassword  method:- updatePassword
* /edit_profile  method:- updateCompanyDetails
* /admin  method:- GetAllCompanyList
* /admin/company/:id  method:- getSingleCompany
* /admin/company/:id  method:- updateCompanyRole
* /admin/company/:id  method:- removeCompany

~ FileName:- CompanyAuthRoutes (api/v1/company/auth)
* /register  method:- registerUser
* /:id/verify/:token  method:- verifyEmail
* /login  method:- login
* /password/forgot  method:- forgotPassword
* /password/reset/:token  method:- resetPassword
* /logout  method:- logout


~ FileName:- JobRoutes(/api/v1/user/company/job)
* /  method:- PostJob
* /  method:- ReadAllJob
* /:id  method:- ReadSpecificJob
* /:id  method:- UpdateJob
* /:id  method:- removeJob

~ FileName:- QuestionRoutes (/api/v1/company/question)
* /  method:- PostJobQuestion
* /  method:- ReadAllJobQuestion
* /:id  method:- ReadSpecificJobQuestion
* /:id  method:- UpdateJobQuestion
* /:id  method:- removeJobQuestion

~ FileName:- AnswerRoutes (/api/v1/user/answer)
* /  method:- PostJobAnswer
* /  method:- ReadAllJobAnswer
* /:id  method:- ReadSpecificJobAnswer

// unnecessary routes
* /:id  method:- UpdateJobAnswer
* /:id  method:- removeJobAnswer


```
