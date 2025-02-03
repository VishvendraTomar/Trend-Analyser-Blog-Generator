import DOMPurify from 'dompurify';

// Utility function to replace list markers, including nested lists
const replaceLists = (text, pattern, listClass) => {
  // Recursive function to handle nested lists
  const processList = (input) => {
    return input.replace(pattern, (match, indent, marker, content) => {
      const markdownLink = content.match(/\[(.*?)\]\((.*?)\)/);
      const plainUrl = content.match(/(https?:\/\/[^\s]+)/g);
      let listItem;

      if (markdownLink) {
        const cleanedUrl = markdownLink[2].replaceAll(' ', '');
        listItem = `<li class="${listClass}"><a href="${cleanedUrl}" target="_blank" class="text-primary hover:underline">${markdownLink[1]}</a></li>`;
      } else if (plainUrl) {
        listItem = `<li class="${listClass}"><a href="${plainUrl[0]}" target="_blank" class="text-primary hover:underline">${plainUrl[0]}</a></li>`;
      } else {
        listItem = `<li class="${listClass}">${content.trim()}</li>`;
      }

      return listItem;
    });
  };

  // Process the text to handle nested lists
  const lines = text.split(/\n/);
  let result = '';
  const stack = []; // Stack to keep track of current list tags

  lines.forEach(line => {
    const indentLevel = line.match(/^\s*/)[0].length; // Count leading spaces
    const isOrdered = /^\d+\./.test(line);
    const isUnordered = /^[*+-]/.test(line);
    const currentTag = isOrdered ? 'ol' : isUnordered ? 'ul' : null;

    // Adjust the stack for nested lists
    while (stack.length > indentLevel) {
      result += `</${stack.pop()}>\n`;
    }

    if (indentLevel === stack.length) {
      // Same level, just add the list item
      result += processList(line);
    } else if (indentLevel > stack.length) {
      // New nested list
      if (currentTag) {
        result += `<${currentTag}>\n`;
        stack.push(currentTag);
      }
      result += processList(line);
    } else {
      // Closing current list and starting a new one
      while (stack.length > indentLevel) {
        result += `</${stack.pop()}>\n`;
      }
      if (currentTag) {
        result += `<${currentTag}>\n`;
        stack.push(currentTag);
      }
      result += processList(line);
    }
  });
  // Close any remaining open lists
  while (stack.length) {
    result += `</${stack.pop()}>\n`;
  }

  return result.trim();
};

export const parseMarkdown = (text, customClasses = {}) => {
  if (!text) return '';

  // Escape raw HTML to prevent XSS
  text = DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

  // Handle headings with better styling
  text = text.replace(/^#{1,6} (.+)$/gm, (match, p1) => {
    const level = match.match(/^#{1,6}/)[0].length;
    const classes = {
      1: 'text-4xl font-bold text-gray-900 mb-6',
      2: 'text-3xl font-semibold text-gray-800 mb-4 mt-8',
      3: 'text-2xl font-semibold text-gray-800 mb-3 mt-6',
      4: 'text-xl font-medium text-gray-700 mb-2 mt-4',
      5: 'text-lg font-medium text-gray-700 mb-2 mt-4',
      6: 'text-base font-medium text-gray-700 mb-2 mt-4'
    };
    return `<h${level} class="${classes[level]}">${p1}</h${level}>`;
  });

  // Handle paragraphs with better spacing and line height
  text = text.replace(/(?:\r?\n){2,}/g, '</p><p class="text-gray-600 leading-relaxed mb-4">');
  text = '<p class="text-gray-600 leading-relaxed mb-4">' + text + '</p>';

  // Handle bold and italic with semantic colors
  text = text
    .replace(/(\*\*|__)(.*?)\1/g, '<strong class="font-semibold text-gray-900">$2</strong>')
    .replace(/(\*|_)(.*?)\1/g, '<em class="text-gray-800 italic">$2</em>');

  // Handle inline code with better styling
  text = text.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-gray-100 text-red-600 rounded text-sm font-mono">$1</code>');

  // Handle code blocks with better styling and optional language
  text = text.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
    return `
      <div class="relative mb-6">
        ${lang ? `<div class="absolute right-4 top-4 text-xs text-gray-400">${lang}</div>` : ''}
        <pre class="bg-gray-50 rounded-lg p-4 overflow-x-auto">
          <code class="${lang ? `language-${lang}` : ''} text-sm font-mono text-gray-800">${code.trim()}</code>
        </pre>
      </div>
    `;
  });

  // Handle blockquotes with better styling
  text = text.replace(/^> (.*)$/gm, 
    '<blockquote class="pl-4 border-l-4 border-gray-200 italic text-gray-700 my-4">$1</blockquote>'
  );

  // Handle horizontal rules
  text = text.replace(/^(---|\*\*\*|___)$/gm, '<hr class="my-8 border-t border-gray-200">');

  // Handle images with better styling
  text = text.replace(/!\[([^\]]*)\]\((.*?)\)/g, 
    '<img src="$2" alt="$1" class="rounded-lg shadow-md max-w-full my-6 mx-auto">'
  );

  // Handle links with better styling
  text = text.replace(/\[([^\]]+)\]\((.*?)\)/g, (match, textContent, url) => {
    const cleanedUrl = url.replaceAll(' ', '');
    return `<a href="${cleanedUrl}" target="_blank" class="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-500">${textContent}</a>`;
  });

  // Handle lists with better styling
  text = replaceLists(text, /^(\s*)([*+-]|\d+\.)\s+(.*)/gm, 'mb-2 text-gray-600');
  
  // Wrap lists in containers with proper spacing
  text = text.replace(/<ul>/g, '<ul class="list-disc pl-6 my-4 space-y-2">');
  text = text.replace(/<ol>/g, '<ol class="list-decimal pl-6 my-4 space-y-2">');

  // Handle tables with better styling
  text = text.replace(/(\|.+\|\n)((?:\|[-:| ]+\|\n)+)((?:\|.*\|\n)*)/g, (match, header, separator, rows) => {
    const headers = header.trim().split('|').slice(1, -1)
      .map(h => `<th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${h.trim()}</th>`)
      .join('');
    
    const alignments = separator.trim().split('|').slice(1, -1).map(s => {
      if (s.trim().startsWith(':') && s.trim().endsWith(':')) return 'text-center';
      if (s.trim().startsWith(':')) return 'text-left';
      if (s.trim().endsWith(':')) return 'text-right';
      return 'text-left';
    });

    const rowsHtml = rows.trim().split('\n').map(row =>
      `<tr class="hover:bg-gray-50">${
        row.trim().split('|').slice(1, -1)
          .map((cell, index) => `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-t border-gray-200 ${alignments[index]}">${cell.trim()}</td>`)
          .join('')
      }</tr>`
    ).join('');

    return `
      <div class="my-6 overflow-x-auto rounded-lg shadow">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50"><tr>${headers}</tr></thead>
          <tbody class="bg-white divide-y divide-gray-200">${rowsHtml}</tbody>
        </table>
      </div>
    `;
  });

  return DOMPurify.sanitize(text, { ADD_ATTR: ['target'] });
};
