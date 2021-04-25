# Notifications

Bilpp includes a powerful notification system to alert users to new activity.

## Notification Types

### Defining a Notification Type

To define a notification type, you will need to create a new class which implements `Bilpp\Notification\Blueprint\BlueprintInterface`. This class will define your notification's content and behaviour through the following methods:

* `getSubject()` The model that the notification is about (eg. the `Post` that was liked).
* `getSender()` The `User` model for the user that triggered the notification.
* `getData()` Any other data you might wish to include for access on the frontend (eg. the old discussion title when renamed).
* `getType()` This is where you name your notification, this will be important for later steps.
* `getSubjectModal()`: Specify the type of model the subject is (from `getSubject`).

Lets take a look at an example from [Bilpp Likes](https://github.com/bilpp/likes/blob/master/src/Notification/PostLikedBlueprint.php):

```php
<?php

namespace Bilpp\Likes\Notification;

use Bilpp\Notification\Blueprint\BlueprintInterface;
use Bilpp\Post\Post;
use Bilpp\User\User;

class PostLikedBlueprint implements BlueprintInterface
{
    public $post;

    public $user;

    public function __construct(Post $post, User $user)
    {
        $this->post = $post;
        $this->user = $user;
    }

    public function getSubject()
    {
        return $this->post;
    }

    public function getSender()
    {
        return $this->user;
    }

    public function getData()
    {
    }

    public static function getType()
    {
        return 'postLiked';
    }

    public static function getSubjectModel()
    {
        return Post::class;
    }
}
```

Take a look at [`DiscussionRenamedBlueprint`](https://github.com/bilpp/core/blob/master/src/Notification/Blueprint/DiscussionRenamedBlueprint.php) if you want another example.

### Registering a Notification Type

Next, let's register your notification so Bilpp knows about it. This will allow users to be able to change how they want to be notified of your notification.
We can do this with the `type` method of the `Notification` extender

* `$blueprint`: Your class static (example: `PostLikedBlueprint::class`)
* `$serializer`: The serializer of your subject model (example: `PostSerializer::class`)
* `$enabledByDefault`: This is where you set which notification methods will be enabled by default. It accepts an array of strings, include 'alert' to have forum notifications (the bell icon), include 'email' for email notifications. You can use, one both, or none! (example: `['alert']` would set only in-forum notifications on by default)

Lets look at an example from [Bilpp Subscriptions](https://github.com/bilpp/subscriptions/blob/master/extend.php):

```php
<?php

use Bilpp\Api\Serializer\BasicDiscussionSerializer;
use Bilpp\Extend
use Bilpp\Subscriptions\Notification\NewPostBlueprint;

return [
    // Other extenders
    (new Extend\Notification())
        ->type(NewPostBlueprint::class, BasicDiscussionSerializer::class, ['alert', 'email']),
    // Other extenders
];
```

Your notification is coming together nicely! Just a few things left to do!

### Mailable Notifications

In addition to registering our notification to send by email, if we actually want it to send, we need to provide a bit more information: namely, code for generating the email subject and body.
To do this, your notification blueprint should implement [`Bilpp\Notification\MailableInterface`](https://api.docs.bilpp.com/php/master/bilpp/notification/mailableinterface) in addition to [`Bilpp\Notification\Blueprint\BlueprintInterface`](https://api.docs.bilpp.com/php/master/bilpp/notification/blueprint/blueprintinterface).
This comes with 2 additional methods:

- `getEmailView()` should return an array of email type to [Blade View](https://laravel.com/docs/6.x/blade) names. The namespaces for these views must [first be registered](routes.md#views). These will be used to generate the body of the email.
- `getEmailSubject(TranslatorInterface $translator)` should return a string for the email subject. An instance of the translator is passed in to enable translated notification emails.

Let's take a look at an example from [Bilpp Mentions](https://github.com/bilpp/mentions/blob/master/src/Notification/PostMentionedBlueprint.php)

```php
<?php

namespace Bilpp\Mentions\Notification;

use Bilpp\Notification\Blueprint\BlueprintInterface;
use Bilpp\Notification\MailableInterface;
use Bilpp\Post\Post;
use Symfony\Contracts\Translation\TranslatorInterface;

class PostMentionedBlueprint implements BlueprintInterface, MailableInterface
{
    /**
     * @var Post
     */
    public $post;

    /**
     * @var Post
     */
    public $reply;

    /**
     * @param Post $post
     * @param Post $reply
     */
    public function __construct(Post $post, Post $reply)
    {
        $this->post = $post;
        $this->reply = $reply;
    }

    /**
     * {@inheritdoc}
     */
    public function getSubject()
    {
        return $this->post;
    }

    /**
     * {@inheritdoc}
     */
    public function getFromUser()
    {
        return $this->reply->user;
    }

    /**
     * {@inheritdoc}
     */
    public function getData()
    {
        return ['replyNumber' => (int) $this->reply->number];
    }

    /**
     * {@inheritdoc}
     */
    public function getEmailView()
    {
        return ['text' => 'bilpp-mentions::emails.postMentioned'];
    }

    /**
     * {@inheritdoc}
     */
    public function getEmailSubject(TranslatorInterface $translator)
    {
        return $translator->trans('bilpp-mentions.email.post_mentioned.subject', [
            '{replier_display_name}' => $this->post->user->display_name,
            '{title}' => $this->post->discussion->title
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public static function getType()
    {
        return 'postMentioned';
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubjectModel()
    {
        return Post::class;
    }
}
```

### Notification Drivers

In addition to registering notification types, we can also add new drivers alongside the default `alert` and `email`.
The driver should implement `Bilpp\Notification\Driver\NotificationDriverInterface`. Let's look at an annotated example from the [Pusher extension](https://github.com/bilpp/pusher/blob/master/src/PusherNotificationDriver.php):

```php
<?php

namespace Bilpp\Pusher;

use Bilpp\Notification\Blueprint\BlueprintInterface;
use Bilpp\Notification\Driver\NotificationDriverInterface;
use Illuminate\Contracts\Queue\Queue;

class PusherNotificationDriver implements NotificationDriverInterface
{
    /**
     * @var Queue
     */
    protected $queue;

    public function __construct(Queue $queue)
    {
        $this->queue = $queue;
    }

    /**
     * {@inheritDoc}
     */
    public function send(BlueprintInterface $blueprint, array $users): void
    {
        // The `send` method is responsible for determining any notifications need to be sent.
        // If not (for example, if there are no users to send to), there's no point in scheduling a job.
        // We HIGHLY recommend that notifications are sent via a queue job for performance reasons.
        if (count($users)) {
            $this->queue->push(new SendPusherNotificationsJob($blueprint, $users));
        }
    }

    /**
     * {@inheritDoc}
     */
    public function registerType(string $blueprintClass, array $driversEnabledByDefault): void
    {
        // This method is generally used to register a user preference for this notification.
        // In the case of pusher, there's no need for this.
    }
}
```

Notification drivers are also registered via the `Notification` extender, using the `driver` method. The following arguments are provided

* `$driverName`: A unique, human readable name for the driver
* `$driverClass`: The class static of the driver (example: `PostSerializer::class`)
* `$typesEnabledByDefault`: An array of types for which this driver should be enabled by default. This will be used in calculating `$driversEnabledByDefault`, which is provided to the `registerType` method of the driver.

Another example from [Bilpp Pusher](https://github.com/bilpp/pusher/blob/master/extend.php):

```php
<?php

use Bilpp\Extend
use Bilpp\Pusher\PusherNotificationDriver;

return [
    // Other extenders
    (new Extend\Notification())
        ->driver('pusher', PusherNotificationDriver::class),
    // Other extenders
];
```

## Rendering Notifications

As with everything in Bilpp, what we register in the backend, must be registered in the frontend as well.

Similar to the notification blueprint, we need tell Bilpp how we want our notification displayed.

First, create a class that extends the notification component. Then, there are 4 functions to add:

* `icon()`: The [Font Awesome](https://fontawesome.com/) icon that will appear next to the notification text (example: `fas fa-code-branch`).
* `href()`: The link that should be opened when the notification is clicked (example: `app.route.post(this.attrs.notification.subject())`).
* `content()`: What the notification itself should show. It should say the username and then the action. It will be followed by when the notification was sent (make sure to use translations).
* `exerpt()`: (optional) A little excerpt that is shown below the notification (commonly an excerpt of a post).

*Let take a look at our example shall we?*

From [Bilpp Subscriptions](https://github.com/bilpp/subscriptions/blob/master/js/src/forum/components/NewPostNotification.js), when a new post is posted on a followed discussion:

```jsx harmony
import Notification from 'bilpp/forum/components/Notification';
import username from 'bilpp/common/helpers/username';

export default class NewPostNotification extends Notification {
  icon() {
    return 'fas fa-star';
  }

  href() {
    const notification = this.attrs.notification;
    const discussion = notification.subject();
    const content = notification.content() || {};

    return app.route.discussion(discussion, content.postNumber);
  }

  content() {
    return app.translator.trans('bilpp-subscriptions.forum.notifications.new_post_text', {user: this.attrs.notification.sender()});
  }
}
```

In the example, the icon is a star, the link will go to the new post, and the content will say that "{user} posted".

Next, we need to tell Bilpp that the notification you send in the backend corresponds to the frontend notification we just created.

Open up your index.js (the forum one) and start off by importing your newly created notification template. Then add the following line:

`app.notificationComponents.{nameOfNotification} = {NotificationTemplate};`

Make sure to replace `{nameOfNotification}` with the name of the notification in your PHP blueprint (`getType()`) and replace `{NotificationTemplate}` with the name of the JS notification template we just made! (Make sure it's imported!)

Let's give users an option to change their settings for your notification. All you have to do is extend the [`notificationGird`](https://github.com/bilpp/core/blob/master/js/src/forum/components/NotificationGrid.js)'s [`notificationTypes()`](https://github.com/bilpp/core/blob/master/js/src/forum/components/NotificationGrid.js#L204) function

From [Bilpp-Likes](https://github.com/bilpp/likes/blob/master/js/src/forum/index.js):

```js
import { extend } from 'bilpp/common/extend';
import app from 'bilpp/forum/app';
import NotificationGrid from 'bilpp/forum/components/NotificationGrid';

import PostLikedNotification from './components/PostLikedNotification';

app.initializers.add('bilpp-likes', () => {
  app.notificationComponents.postLiked = PostLikedNotification;

  extend(NotificationGrid.prototype, 'notificationTypes', function (items) {
    items.add('postLiked', {
      name: 'postLiked',
      icon: 'far fa-thumbs-up',
      label: app.translator.trans('bilpp-likes.forum.settings.notify_post_liked_label')
    });
  });
});
```
Simply add the name of your notification (from the blueprint), an icon you want to show, and a description of the notification and you are all set!

## Sending Notifications

*Data doesn't just appear in the database magically*

Now that you have your notification all setup, it's time to actually send the notification to the user!

Thankfully, this is the easiest part, simply use[`NotificationSyncer`](https://github.com/bilpp/core/blob/master/src/Notification/NotificationSyncer.php)'s sync function. It accepts 2 arguments:

* `BlueprintInterface`: This is the blueprint to be instantiated we made in the first step, you must include all variables that are used on the blueprint (example: if a user likes a post you must include the `user` model that liked the post).
* `$users`: This accepts an array of `user` modals that should receive the notification

*Whats that? You want to be able to delete notifications too?* The easiest way to remove a notification is to pass the exact same data as sending a notification, except with an empty array of recipients.

Lets take a look at our **final** example for today:

From [Bilpp Likes](https://github.com/bilpp/likes/blob/master/src/Listener/SendNotificationWhenPostIsLiked.php):

```php
<?php

namespace Bilpp\Likes\Listener;

use Bilpp\Event\ConfigureNotificationTypes;
use Bilpp\Likes\Event\PostWasLiked;
use Bilpp\Likes\Event\PostWasUnliked;
use Bilpp\Likes\Notification\PostLikedBlueprint;
use Bilpp\Notification\NotificationSyncer;
use Bilpp\Post\Post;
use Bilpp\User\User;
use Illuminate\Contracts\Events\Dispatcher;

class SendNotificationWhenPostIsLiked
{
    protected $notifications;

    public function __construct(NotificationSyncer $notifications)
    {
        $this->notifications = $notifications;
    }

    public function subscribe(Dispatcher $events)
    {
        $events->listen(PostWasLiked::class, [$this, 'whenPostWasLiked']);
        $events->listen(PostWasUnliked::class, [$this, 'whenPostWasUnliked']);
    }

    public function whenPostWasLiked(PostWasLiked $event)
    {
        $this->syncNotification($event->post, $event->user, [$event->post->user]);
    }

    public function whenPostWasUnliked(PostWasUnliked $event)
    {
        $this->syncNotification($event->post, $event->user, []);
    }

    public function syncNotification(Post $post, User $user, array $recipients)
    {
        if ($post->user->id != $user->id) {
            $this->notifications->sync(
                new PostLikedBlueprint($post, $user),
                $recipients
            );
        }
    }
}
```

**Awesome!** Now you can spam users with updates on happenings around the forum!

*Tried everything?* Well if you've tried everything then I guess... Kidding. Feel free to post in the [Bilpp Community](https://discuss.bilpp.com/t/extensibility) or in the [Discord](https://bilpp.com/discord/) and someone will be around to lend a hand!
