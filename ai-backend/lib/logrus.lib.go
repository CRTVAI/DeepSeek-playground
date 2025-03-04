package lib

import (
	"os"

	"github.com/sirupsen/logrus"
)

func ConfigurLogger() {
	logger := &logrus.Logger{
		Out:   os.Stderr,
		Level: logrus.DebugLevel,
		Formatter: &logrus.TextFormatter{
			TimestampFormat: "2006-01-02 15:04:05",
			FullTimestamp:   true,
			ForceColors:     true,
			ForceQuote:      true,
		},
	}

	// Set the logrus logger as the default logger for Logrus
	logrus.SetFormatter(logger.Formatter)
	logrus.SetOutput(logger.Out)
	logrus.SetLevel(logger.Level)
	logrus.SetLevel(logrus.DebugLevel)
}
