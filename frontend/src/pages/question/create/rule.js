const createQuestionRules = `
A tag is a keyword or label that categorizes your question with other, similar questions. Choose one or more (up to 5) tags that will help answerers to find and interpret your question.

**Complete the sentence:** My question is about...

**Tags:**
- [reactjs] (if your question is about React development)
- [javascript] (if it involves JavaScript programming)
- [web-development] (for general web development questions)
- [github] (if it pertains to GitHub usage)
- [programming] (for questions related to programming concepts)

*Use tags that describe things or concepts that are essential, not incidental to your question. Favor using existing popular tags. Read the descriptions that appear below the tag. If your question is primarily about a topic for which you can't find a tag: combine multiple words into single-words with hyphens (e.g. python-3.x), up to a maximum of 35 characters. Creating new tags is a privilege; if you can't yet create a tag you need, then post this question without it, then ask the community to create it for you.*

`;
const titleRules = `
Your title should summarize the problem.

You might find that you have a better idea of your title after writing out the rest of the question.
`;
const contentRules = `
Explain how you encountered the problem you’re trying to solve, and any difficulties that have prevented you from solving it yourself.
`;
const writeAGoodQuestion = `
# Steps to Writing a Good Programming Question

## 1. Summarize your problem in a one-line title.

Choose a clear and concise title that summarizes your issue. It should give potential answerers a quick overview of your question.

Example: "Error when deploying React app to Heroku: 'Module not found'"

## 2. Describe your problem in more detail.

Provide a detailed explanation of the problem you're facing. Include relevant code snippets, error messages, or any other information that can help others understand your issue.

Example: 
I'm encountering an issue while trying to deploy my React app to Heroku. The specific error message is 'Module not found.' I've checked my dependencies, and everything seems fine locally. However, the problem arises during the deployment process. 

## 3. Describe what you tried and what you expected to happen.

Explain the steps you've taken to troubleshoot or solve the problem. Highlight any specific approaches you've tried, and be clear about what you expected the outcome to be.

Example:
I've double-checked my package.json, ensured all dependencies are up-to-date, and followed the Heroku deployment documentation. Locally, the app runs without any issues. However, when deploying to Heroku, the build fails with the mentioned 'Module not found' error.

## 4. Add “tags” which help surface your question to members of the community.

Use relevant tags to categorize your question. This helps others with similar expertise find and answer your question more efficiently.

Example:
- [reactjs]
- [heroku]
- [deployment]
- [javascript]

## 5. Review your question and post it to the site.

Before posting, review your question to ensure it's clear, well-formatted, and includes all necessary details. Make sure your title, description, and tags accurately represent your problem.

Once satisfied, go ahead and post your question to the community site, and be ready to engage with any clarifications or suggestions from fellow members.
`;
const writeAGoodQuestionVie = `
# Cách Để Viết Một Câu Hỏi Lập Trình Chất Lượng, Xịn Sò

## 1. Tóm tắt vấn đề của bạn gọn trong một dòng tiêu đề.

Chọn một tiêu đề rõ ràng và ngắn gọn mô tả vấn đề của bạn. Nó nên cung cấp cho những người trả lời đầy đủ thông tin về câu hỏi của bạn.

Ví dụ: "Lỗi khi triển khai ứng dụng React lên Heroku: 'Module not found'"

## 2. Mô tả vấn đề của bạn chi tiết hơn.

Cung cấp một giải thích chi tiết về vấn đề bạn đang gặp phải. Bao gồm các đoạn code liên quan, thông báo lỗi, hoặc bất kỳ thông tin nào khác có thể giúp người khác hiểu vấn đề của bạn.

Ví dụ:
Tôi gặp vấn đề khi cố gắng triển khai ứng dụng React của mình lên Heroku. Thông báo lỗi cụ thể là 'Module not found.' Tôi đã kiểm tra các phụ thuộc, và mọi thứ đều ổn khi chạy ở cấp độ local. Tuy nhiên, vấn đề xảy ra trong quá trình triển khai.

## 3. Mô tả những gì bạn đã thử và mong đợi điều gì sẽ xảy ra.

Mô tả những bước bạn đã thực hiện để sửa chữa hoặc giải quyết vấn đề. Đặt mức độ chính xác về những gì bạn mong đợi sẽ xảy ra.

Ví dụ:
Tôi đã kiểm tra file package.json của mình, đảm bảo tất cả các phụ thuộc được cập nhật, và tuân theo tài liệu triển khai của Heroku. Tại cấp độ local, ứng dụng chạy mà không gặp vấn đề. Tuy nhiên, khi triển khai lên Heroku, quá trình xây dựng thất bại với lỗi 'Module not found' đã nêu.

## 4. Thêm "tag" hay thẻ giúp câu hỏi của bạn dễ dàng được tìm thấy.

Sử dụng các "tag" phù hợp để phân loại câu hỏi của bạn. Điều này giúp những người có chuyên môn tương tự dễ dàng tìm và trả lời câu hỏi của bạn hơn.

Ví dụ:
- [reactjs]
- [heroku]
- [triển khai]
- [javascript]

## 5. Xem lại câu hỏi và đăng lên trang.

Trước khi đăng, xem lại câu hỏi của bạn để đảm bảo nó rõ ràng, được định dạng đúng và bao gồm tất cả các chi tiết cần thiết. Hãy chắc chắn rằng tiêu đề, mô tả và các "tags" mô tả chính xác vấn đề của bạn.

Khi hài lòng, hãy đăng câu hỏi của bạn lên cộng đồng và sẵn sàng tham gia vào bất kỳ giải đáp hoặc gợi ý nào từ các thành viên khác.

`;
export {
  createQuestionRules,
  titleRules,
  contentRules,
  writeAGoodQuestion,
  writeAGoodQuestionVie,
};
