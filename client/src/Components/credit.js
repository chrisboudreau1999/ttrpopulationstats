import React from 'react';

export default function Credit() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Credit</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            This project is based on the Twitter account{' '}
            <a
              href="https://x.com/ttr_population"
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Toontown Population Bot
            </a>
            .
          </p>
          <p>
            This bot was used to show off the change of playerbase throughout the day back in 2020 and seems to be no longer in operation.
          </p>
          <p>
            This project takes the daily player count per hour throughout a few months to try and estimate the average
            playerbase per hour to see when it is most optimal to play Toontown.
          </p>
          <p>
            I find it interesting to compare the data collected here from July 2024-present to the Twitter bot, seeing
            that due to COVID, the average playerbase is about double what it is today.
          </p>
          <p>
            This project could not be possible without the{' '}
            <a
              href="https://www.toontownrewritten.com/api/population"
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ToonTown Population API
            </a>
            .
          </p>
          <p>
            Feel free to check out the{' '}
            <a
              href="https://github.com/chrisboudreau1999/ttrpopulationstats"
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              repo here
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
