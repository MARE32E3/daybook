fetch('/book')
  .then(res => res.json())
  .then(book => {
    const imgSrc = book.open_image || book.image_url;
    // Shorten description to 3 sentences
    let desc = book.description || "";
    let sentences = desc.match(/[^\.!\?]+[\.!\?]+/g) || [desc];
    let shortDesc = sentences.slice(0, 3).join(" ");
    if (sentences.length > 3) shortDesc += " ...";

    document.getElementById('book-card').innerHTML = `
    <div class="max-w-4xl w-full bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden">
      <div class="md:w-1/3 w-full flex items-center justify-center bg-gray-50">
        <img src="${imgSrc}" alt="${book.title} Cover"
             class="max-w-xs h-64 object-contain mx-auto my-4 rounded-lg shadow">
      </div>
      <div class="md:w-2/3 w-full p-8 flex flex-col justify-between">
        <div class="mb-4">
          <p class="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-1 flex items-center">
            <span class="w-3 h-3 rounded-full bg-teal-400 mr-2 inline-block"></span> Book of the Day
          </p>
          <h2 class="text-3xl font-bold text-gray-900 leading-tight mb-1">${book.title}</h2>
          <p class="text-base text-gray-700 mb-1">by <span class="italic">${book.author}</span></p>
          <div class="flex items-center text-xs text-gray-500 mb-4">
            ${book.year ? `<span class="mr-3">${book.year}</span><span class="mr-3">•</span>` : ""}
            ${book.pages ? `<span class="mr-3">${book.pages} pages</span><span>•</span>` : ""}
            <span class="ml-3">ISBN: ${book.isbn}</span>
          </div>
          <span class="inline-block text-xs font-medium px-3 py-1 rounded-full mb-4 bg-pink-500 text-white">
            ${book.category}
          </span>
          <p class="text-sm text-gray-700 leading-relaxed mb-4">
            ${shortDesc}
          </p>
        </div>
        <div>
          <a href="${book.bookwyrm_url}" target="_blank"
             class="inline-block bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold py-2 px-5 rounded-lg transition">
            🔗 Open in BookWyrm
          </a>
        </div>
      </div>
    </div>
    `;
  });